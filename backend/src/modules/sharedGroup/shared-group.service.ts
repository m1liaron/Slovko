import { HttpError } from "@/libs/constants/http-error.js";

import {
  type CopySharedGroupBody,
  type CreateSharedGroupBody,
} from "./libs/types";
import { SharedGroupRepository } from "./shared-group.repository.js";

function isValidWordPair(word: string, translateWord: string) {
  const trimmedWord = word.trim();
  const trimmedTranslate = translateWord.trim();
  return (
    !!trimmedWord &&
    !!trimmedTranslate &&
    trimmedWord.length >= 2 &&
    trimmedTranslate.length >= 2
  );
}

const SharedGroupService = {
  async createSharedGroup(userId: string, body: CreateSharedGroupBody) {
    const { groupId, title, isAnonymous } = body;

    const sharedGroup = await SharedGroupRepository.findGroupWithCards(groupId);

    if (!sharedGroup || !sharedGroup.cards) {
      throw HttpError.badRequest("Group is not defined");
    }
    if (sharedGroup.cards.length === 0) {
      throw HttpError.badRequest("Group doesn't have cards to share");
    }

    const newSharedGroup = await SharedGroupRepository.createSharedGroup({
      title: title ? title : sharedGroup.title,
      userId,
      isAnonymous,
      wordsLength: sharedGroup.cards.length,
    });

    const foundSharedGroup = await SharedGroupRepository.findGroupWithCards(
      newSharedGroup.id,
    );

    if (foundSharedGroup) {
      await Promise.all(
        foundSharedGroup.cards.map(
          async (card: { word: string; translateWord: string }) => {
            if (!isValidWordPair(card.word, card.translateWord)) return;

            await SharedGroupRepository.createSharedCard({
              word: card.word,
              translateWord: card.translateWord,
              sharedGroupId: sharedGroup.id,
            });
          },
        ),
      );
    }

    return SharedGroupRepository.findByIdWithUser(sharedGroup.id);
  },

  async getAllSharedGroups(page: string, limit: string) {
    const allSharedGroups = await SharedGroupRepository.findAllWithUser();

    const pageNumber = Number.parseInt(page, 10) || 1;
    const itemsPerPage = Number.parseInt(limit, 10) || 5;
    const skip = (pageNumber - 1) * itemsPerPage;

    const filteredSharedGroups = allSharedGroups.slice(
      skip,
      skip + itemsPerPage,
    );
    const haveMoreSharedGroups = skip + itemsPerPage < allSharedGroups.length;

    return { sharedGroups: filteredSharedGroups, haveMoreSharedGroups };
  },

  getSharedGroup(sharedGroupId: string) {
    return SharedGroupRepository.findByIdWithCardsAndUser(sharedGroupId);
  },

  async removeSharedGroup(userId: string, sharedGroupId: string) {
    const sharedGroup = await SharedGroupRepository.findByIdAndUserId(
      sharedGroupId,
      userId,
    );
    if (!sharedGroup) {
      throw HttpError.notFound("Group not found");
    }

    const { id } = sharedGroup;

    await SharedGroupRepository.deleteSharedGroup(id);
    return id;
  },

  async copySharedGroup(body: CopySharedGroupBody, sharedGroupId: string) {
    const { sectionId } = body;

    const sharedGroup =
      await SharedGroupRepository.findByIdWithCards(sharedGroupId);

    if (!sharedGroup) {
      throw HttpError.notFound("Shared group is not found");
    }
    if (!sharedGroup.sharedCards) {
      throw HttpError.badRequest("No cards to share");
    }

    if (sectionId && sectionId.length > 0) {
      const existGroupData =
        await SharedGroupRepository.findGroupBySectionAndTitle(
          sectionId,
          sharedGroup.title,
        );
      if (existGroupData) {
        throw HttpError.badRequest("You already have group with this name");
      }
      const newGroup = await SharedGroupRepository.createGroup({
        title: sharedGroup.title,
        sectionId,
      });

      if (sharedGroup.sharedCards.length > 0) {
        await Promise.all(
          sharedGroup.sharedCards.map(
            async (card: { word: string; translateWord: string }) => {
              if (!isValidWordPair(card.word, card.translateWord)) return;

              await SharedGroupRepository.createCard({
                word: card.word,
                translateWord: card.translateWord,
                groupId: newGroup.id,
              });
            },
          ),
        );
      }

      return newGroup;
    }
  },
};

export { SharedGroupService };
