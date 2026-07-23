import { eq, sql } from "drizzle-orm";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";

import { unsplash } from "@/api/unsplash.js";
import { senses } from "@/db/models/decks/senses.js";
import { Image } from "@/db/models/index";
import { db } from "@/drizzle/index.js";
import { calculateNextReviewDate, getDictionaryData } from "@/helpers/index";
import type { AuthRequestHandler } from "@/libs/types/auth-request.type.js";

import { Card, Group } from "../index";


const getRepeatedCards: AuthRequestHandler = async (req, res) => {
  const { sectionId } = req.params;

  const groups = await Group.findAll({
    where: {
      sectionId,
    },
    attributes: ["id", "title"],
    raw: true,
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
        raw: true,
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
};

const getCardsFromIds = async (req: Request, res: Response) => {
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
    raw: true,
    include: [{ model: Image, as: "image" }],
  });

  res.status(200).json(cards);
};

const getAllCards = async (req: Request, res: Response) => {
  const { groupId } = req.params;

  const cards = await Card.findAll({
    where: {
      groupId,
    },
    include: [{ model: Image, as: "image" }],
  });

  res.status(200).json(cards);
};

const getAllStatusCards = async (req: Request, res: Response) => {
  const { status, groupId } = req.params;

  const cards = await Card.findAll({
    where: { status, groupId },
  });

  res.status(200).json(cards);
};

const updateCardsAfterReview = async (req: Request, res: Response) => {
  const cardsIds = req.body;
  if (!Array.isArray(cardsIds) || cardsIds.length === 0) {
    return res.status(400).json({
      error: "Invalid request. Provide an array of card IDs.",
    });
  }

  const cardsToUpdate = await Card.findAll({
    where: { id: { [Op.in]: cardsIds } },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const updatePromises = cardsToUpdate.map((cardInstance) => {
    const cardNextReview = cardInstance.nextReviewAt
      ? new Date(cardInstance.nextReviewAt).setHours(0, 0, 0, 0)
      : null;

    if (cardNextReview && cardNextReview >= today.getTime()) {
      return null;
    }

    const newReviewCount = (cardInstance.reviewCount || 0) + 1;
    const nextReviewDate = calculateNextReviewDate(newReviewCount);

    return cardInstance.update({
      learnedAt: new Date(),
      reviewCount: newReviewCount,
      nextReviewAt: nextReviewDate,
      status: newReviewCount >= 12 ? "Know" : "Repeated",
    });
  });

  const results = await Promise.all(updatePromises);
  const updatedCards = results.filter((card): card is Card => card !== null);

  res.status(200).json(updatedCards);
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

  if (!word.length || !translateWord.length) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: true,
      message: "Word and translate must be filled",
    });
  }
  const existingCardData = await Card.findOne({
    where: {
      groupId,
      word: { [Op.iLike]: word },
    },
  });
  const existingCard = existingCardData?.toJSON();

  if (existingCard) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: true,
      message: "Card with this word already exists",
    });
  }

  const headwordResult = await db.execute<{
    id: number;
    language_id: number;
    word: string;
    pos: string;
    level: string;
  }>(
    sql`
        SELECT id, language_id, word, pos, level
        FROM headwords
        WHERE word = ${word.toLowerCase()}
      `,
  );

  let senseId: number | null = null;

  if (headwordResult.rows.length > 0) {
    const headword = headwordResult.rows[0];
    console.log("Headword: ", headword);
    const senseResult = await db
      .select()
      .from(senses)
      .where(eq(senses.headwordId, headword.id))
      .orderBy(senses.id);

    const sense = senseResult[0];
    senseId = sense?.id ?? null;
  }

  let definition = customDefinition;
  let example = customExample;

  if (!definition || !example) {
    const dictionaryData = await getDictionaryData(word);
    definition = dictionaryData.definition ?? "";
    example = dictionaryData.example ?? "";
  }

  let imageUrl = imageUri;

  if (!imageUrl) {
    const result = await unsplash.photos.getRandom({ query: word, count: 1 });
    const photo = Array.isArray(result.response)
      ? result.response[0]
      : result.response;

    imageUrl = photo?.urls?.regular ?? "";
  }

  let image = null;
  if (imageUrl.length > 0) {
    image = await Image.create({ url: imageUrl });
  }

  const imageId = image && image.id ? image.id : null;

  const newCardData = await Card.create({
    imageId,
    word,
    translateWord,
    groupId,
    definition,
    example,
    senseId: senseId ?? null,
  });

  const newCard = newCardData.toJSON();

  const card = await Card.findOne({
    where: { id: newCard.id, groupId },
    include: [{ model: Image, as: "image" }],
  });

  return res.status(StatusCodes.OK).json(card);
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
  } catch {
    await transaction.rollback();
  }
};

const updateCard = async (req: Request, res: Response) => {
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
};

const removeCard = async (req: Request, res: Response) => {
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
