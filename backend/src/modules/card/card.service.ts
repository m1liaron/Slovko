import { HttpError } from "@/libs/constants/http-error.js";
import { CardRepository } from "./card.repository.js";
import { DictionaryRepository } from "../dictionary/dictionary.repository.js";
import { getDictionaryData } from "@/helpers/getDictionaryData.js";
import { unsplash } from "@/api/unsplash.js";
import { ImageRepository } from "../image";
import { calculateNextReviewDate } from "@/helpers/calculateNextReviewDate.js";
import { db } from "@/db/drizzle.js";
import { Card } from "./card.model.js";

const CardService = {
    
    async getAllStatusCards(status: Card["status"], groupId: string) {
        return CardRepository.findByStatusAndGroup(status, groupId);
    },

    async addManyCards(
        rawCards: Array<{
            word: string;
            translateWord: string;
            imageUri: string;
            groupId: string;
        }>,
    ) {
        if (!Array.isArray(rawCards) || rawCards.length === 0) {
            throw HttpError.badRequest("Must provide an array of cards");
        }

        return db.transaction(async (tx) => {
            const groupId = rawCards[0].groupId;
            const words = rawCards.map((c) => c.word);

            const existing = await CardRepository.findExistingWordsInGroup(groupId, words, tx);
            const existingWords = new Set(existing.map((c) => c.word.toLowerCase()));

            const toInsert = rawCards.filter((c) => !existingWords.has(c.word.toLowerCase()));

            const createdImages = await Promise.all(
                toInsert.map((c) => ImageRepository.create({ url: c.imageUri }, tx)),
            );

            const cardsData = toInsert.map((c, i) => ({
                word: c.word,
                translateWord: c.translateWord,
                imageId: createdImages[i].id,
                groupId: c.groupId,
            }));

            return CardRepository.bulkCreate(cardsData, tx);
        });
    },

    async updateCard(cardId: string, groupId: string, data: Partial<Card>): Promise<Card> {
        const updated = await CardRepository.updateByIdAndGroup(cardId, groupId, data);
        if (!updated) {
            throw HttpError.notFound("Card not found");
        }
        return updated;
    },

    async removeCard(cardId: string): Promise<string> {
        const deleted = await CardRepository.deleteById(cardId);
        if (!deleted) {
            throw HttpError.notFound("Card not found");
        }
        return cardId;
    },

    async getRepeatedCards(sectionId: string) {
        const rows = await CardRepository.findRepeatedCardsBySection(sectionId);

        const byGroup = new Map<string, { title: string; cards: string[] }>();

        for (const row of rows) {
            const existing = byGroup.get(row.groupId);
            if (existing) {
                existing.cards.push(row.cardId);
            } else {
                byGroup.set(row.groupId, { title: row.groupTitle, cards: [row.cardId] });
            }
        }

        return Array.from(byGroup.values());
    },

    async getCardsFromIds(cardIds: unknown) {
        if (!Array.isArray(cardIds) || cardIds.length === 0) {
            throw HttpError.badRequest("Invalid card IDs provided");
        }

        return CardRepository.findByIdsWithImage(cardIds as string[]);
    },

    async updateCardsAfterReview(cardIds: unknown) {
        if (!Array.isArray(cardIds) || cardIds.length === 0) {
            throw HttpError.badRequest("Invalid request. Provide an array of card IDs.");
        }

        const cardsToUpdate = await CardRepository.findByIds(cardIds as string[]);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const updatePromises = cardsToUpdate.map((card) => {
            const cardNextReview = card.nextReviewAt
                ? new Date(card.nextReviewAt).setHours(0, 0, 0, 0)
                : null;

            if (cardNextReview && cardNextReview >= today.getTime()) {
                return null;
            }

            const newReviewCount = (card.reviewCount || 0) + 1;
            const nextReviewDate = calculateNextReviewDate(newReviewCount);

            return CardRepository.updateById(card.id, {
                learnedAt: new Date(),
                reviewCount: newReviewCount,
                nextReviewAt: nextReviewDate,
                status: newReviewCount >= 12 ? "Know" : "Repeated",
            });
        });

        const results = await Promise.all(updatePromises);
        return results.filter((card) => card !== null && card !== undefined);
    },

    async addCard(input: {
        imageUri?: string;
        word: string;
        translateWord: string;
        groupId: string;
        example?: string;
        definition?: string;
    }) {
        const { imageUri, word, translateWord, groupId, example: customExample, definition: customDefinition } = input;

        if (!word?.length || !translateWord?.length) {
            throw HttpError.badRequest("Word and translate must be filled");
        }

        const existingCard = await CardRepository.findByGroupAndWordCI(groupId, word);
        if (existingCard) {
            throw HttpError.badRequest("Card with this word already exists");
        }

        let senseId: number | null = null;
        const headword = await DictionaryRepository.findHeadwordByWord(word);
        if (headword) {
            const sense = await DictionaryRepository.findFirstSenseByHeadwordId(headword.id);
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
            const photo = Array.isArray(result.response) ? result.response[0] : result.response;
            imageUrl = photo?.urls?.regular ?? "";
        }

        let imageId: string | null = null;
        if (imageUrl && imageUrl.length > 0) {
            const image = await ImageRepository.create({ url: imageUrl });
            imageId = image?.id ?? null;
        }

        const newCard = await CardRepository.create({
            imageId,
            word,
            translateWord,
            groupId,
            definition,
            example,
            senseId,
        });

        const card = await CardRepository.findByIdAndGroupWithImage(newCard.id, groupId);
        return card;
    },
};

export { CardService };