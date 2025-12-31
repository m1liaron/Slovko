import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";

import { unsplash } from "../api/unsplash.js";
import type { AuthRequestHandler } from "../common/types/AuthRequest.type.js";
import { db } from "../db/index.js";
import { headwords } from "../db/schema/headwords.js";
import { senses } from "../db/schema/senses.js";
import {
  calculateNextReviewDate,
  getDictionaryData,
  sendError,
} from "../helpers/index.js";
import { Card, Image, Group } from "../models/models.js";

const getRepeatedCards: AuthRequestHandler = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const groups = await Group.findAll({
      where: {
        sectionId,
      },
      attributes: ["id", "title"],
    });
    const repeatedCardsData = await Promise.all(
      groups.map(async (group) => {
        const cards = await Card.findAll({
          where: {
            groupId: group.id,
            nextReviewAt: {
              [Op.lte]: new Date(), // Cards ready for review
            },
          },
          attributes: ["id"], // Fetch only card IDs
        });

        return {
          title: group.title,
          cards: cards.map((card) => card.id), // Extract IDs into an array
        };
      }),
    );

    const filteredData = repeatedCardsData.filter(
      (group) => group.cards.length > 0,
    );

    res.status(200).json(filteredData);
  } catch (error) {
    sendError(res, error);
  }
};

const getCardsFromIds = async (req: Request, res: Response) => {
  try {
    const cardsIds = req.body;
    if (!Array.isArray(cardsIds) || cardsIds.length === 0) {
      return res
        .status(400)
        .send({ error: true, message: "Invalid card IDs provided" });
    }
    const cards = await Card.findAll({
      where: {
        id: {
          [Op.in]: cardsIds, // Match any of the IDs in the array
        },
      },
      include: [{ model: Image, as: "image" }],
    });

    res.status(200).json(cards);
  } catch (error) {
    sendError(res, error);
  }
};

const getAllCards = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  console.log("GroupId: ", groupId);
  try {
    const cards = await Card.findAll({
      where: {
        groupId,
      },
      include: [{ model: Image, as: "image" }],
    });

    res.status(200).json(cards);
  } catch (error) {
    sendError(res, error);
  }
};

const getAllStatusCards = async (req: Request, res: Response) => {
  const { status, groupId } = req.params;
  try {
    const cards = await Card.findAll({
      where: { status, groupId },
    });

    res.status(200).json(cards);
  } catch (error) {
    sendError(res, error);
  }
};

const updateCardsAfterReview = async (req: Request, res: Response) => {
  try {
    const cardsIds = req.body;
    if (!Array.isArray(cardsIds) && cardsIds.length <= 0) {
      return res.status(400).send({
        error: "Invalid request. Provide an array of card IDs.",
      });
    }
    const cardsToUpdate = await Card.findAll({
      where: { id: { [Op.in]: cardsIds } },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const card of cardsToUpdate) {
      const cardNextReview = card.nextReviewAt
        ? new Date(card.nextReviewAt).setHours(0, 0, 0, 0)
        : null;

      if (cardNextReview && cardNextReview >= today.getTime()) {
        continue;
      }

      const newReviewCount = card.reviewCount;
      const nextReviewDate = calculateNextReviewDate(newReviewCount);

      if (card.reviewCount >= 12) {
        card.status = "Know";
      } else {
        card.status = "Learned";
      }

      card.status = "Repeated";
      card.learnedAt = new Date();
      card.reviewCount = newReviewCount + 1;
      card.nextReviewAt = nextReviewDate;

      await card.save();
    }

    res.status(StatusCodes.OK).json(cardsToUpdate);
  } catch (error) {
    sendError(res, error);
  }
};

const addCard = async (req: Request, res: Response) => {
  const {
    imageUri,
    word,
    translateWord,
    groupId,
    example: customExample,
    definition: customDefinition,
  } = req.body;
  try {
    const findCard = await Card.findOne({
      where: {
        groupId: groupId,
        word: {
          [Op.iLike]: word,
        },
      },
    });
    if (findCard) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: true, message: "Картка з цим словом вже існує" });
    }

    const headwordResult = await db
      .select()
      .from(headwords)
      .where(eq(headwords.word, word))
      .limit(1);

    const headword = headwordResult[0];

    const senseResult = await db
      .select()
      .from(senses)
      .where(eq(senses.headwordId, headword.id))
      .limit(1);
    const sense = senseResult[0];

    let definition = customExample;
    let example = customDefinition;

    if (definition.length === 0 || example.length === 0) {
      try {
        const dictionaryData = await getDictionaryData(word);
        definition = dictionaryData.definition || "";
        example = dictionaryData.example || "";
      } catch (dictionaryError) {
        if (dictionaryError instanceof Error) {
          console.warn("Dictionary fetch failed:", dictionaryError.message);
        }
      }
    }

    let imageUrl = imageUri;

    if (imageUri.length === 0) {
      try {
        const result = await unsplash.photos.getRandom({
          query: word,
          count: 1,
        });

        if (!result || result.errors) {
          console.warn("Unsplash error:", result?.errors);
        } else {
          let photo = result.response;

          if (Array.isArray(photo)) {
            photo = photo[0];
          }
          // This URL is what you need

          imageUrl = photo.urls.regular;
          console.log("Random Unsplash image:", imageUrl);
          // assign wherever you need
        }
      } catch (unsplashError) {
        if (unsplashError instanceof Error) {
          console.warn("Fetching random image failed:", unsplashError.message);
        }
      }
    }

    const image = await Image.create({ url: imageUrl });
    const newCard = await Card.create({
      imageId: image.id,
      word,
      translateWord,
      groupId,
      definition,
      example,
      senseId: sense.id,
    });

    const card = await Card.findOne({
      where: { id: newCard.id, groupId },
      include: [{ model: Image, as: "image" }],
    });

    return res.status(StatusCodes.OK).json(card);
  } catch (error) {
    sendError(res, error);
  }
};

const addManyCards = async (req: Request, res: Response) => {
  const { cards } = req.body; // [ { word, translateWord, imageUri, groupId }, … ]
  if (!Array.isArray(cards) || !cards.length) {
    return res.status(400).json({ error: "Must provide an array of cards" });
  }

  const sequelize = Card.sequelize;
  if (!sequelize) return;
  const transaction = await sequelize.transaction();

  try {
    // 1) Prevent duplicates in the same group
    const existing = await Card.findAll({
      where: {
        groupId: cards[0].groupId,
        [Op.or]: cards.map((c) => ({
          word: { [Op.iLike]: c.word },
        })),
      },
      transaction,
    });
    const existingWords = new Set(existing.map((c) => c.word.toLowerCase()));

    // 2) Filter out duplicates client-side
    const toInsert = cards.filter(
      (c) => !existingWords.has(c.word.toLowerCase()),
    );

    // 3) Bulk‐create all Images if needed
    const createdImages = await Promise.all(
      toInsert.map((c) => Image.create({ url: c.imageUri }, { transaction })),
    );

    // 4) Bulk‐create Cards
    const cardsData = toInsert.map((c, i) => ({
      word: c.word,
      translateWord: c.translateWord,
      imageId: createdImages[i].id,
      groupId: c.groupId,
      // definition & example can be fetched client-side or omitted here
    }));
    const newCards = await Card.bulkCreate(cardsData, { transaction });

    await transaction.commit();
    res.status(201).json(newCards);
  } catch (error) {
    await transaction.rollback();
    sendError(res, error);
  }
};

const updateCard = async (req: Request, res: Response) => {
  try {
    const cardId = req.params.id;
    const { groupId } = req.body;
    const updatedCard = await Card.update(req.body, {
      where: { id: cardId, groupId },
      returning: true,
    });

    if (updatedCard[0] === 0) {
      return res.status(404).json({ error: true, message: "Card not found" });
    }

    const card = await Card.findOne({
      where: { id: cardId },
    });

    res.status(200).json(card);
  } catch (error) {
    sendError(res, error);
  }
};

const removeCard = async (req: Request, res: Response) => {
  try {
    const cardId = req.params.id;
    const card = await Card.findOne({
      where: { id: cardId },
    });
    if (!card) {
      res.status(404).send({ error: true, message: "Card not found" });
      return;
    }
    await card.destroy();
    res.status(200).json(cardId);
  } catch (error) {
    sendError(res, error);
  }
};

export {
  getAllCards,
  addCard,
  addManyCards,
  removeCard,
  updateCard,
  updateCardsAfterReview,
  getAllStatusCards,
  getRepeatedCards,
  getCardsFromIds,
};
