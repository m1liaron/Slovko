import { HttpError } from "@/libs/constants/http-error.js";
import { CardRepository } from "@/modules/card/card.repository.js";

import type { NewGroup, Group } from "./group.model.js";
import { GroupRepository } from "./group.repository.js";


const GroupService = {
  async getAllGroups(sectionId: string) {
    return GroupRepository.findAllBySection(sectionId);
  },

  async getGroup(groupId: string) {
    const group = await GroupRepository.findOneWithCounts(groupId);
    if (!group) {
      throw HttpError.notFound("Group does not exist");
    }
    return group;
  },

  async addGroup(title: string, sectionId: string): Promise<Group> {
    const existing = await GroupRepository.findByTitleAndSection(
      title,
      sectionId,
    );
    if (existing) {
      throw HttpError.badRequest("Group already exists");
    }
    return GroupRepository.create({ title, sectionId });
  },

  async updateGroup(
    groupId: string,
    data: Partial<NewGroup>,
  ): Promise<Group> {
    const updated = await GroupRepository.updateById(
      groupId,
      data,
    );
    if (!updated) {
      throw HttpError.notFound("Group not found");
    }
    return updated;
  },

  async removeGroup(groupId: string): Promise<{ id: string }> {
    const group = await GroupRepository.findById(groupId);
    if (!group) {
      throw HttpError.notFound("Group not found");
    }

    await CardRepository.deleteByGroupId(groupId);
    await GroupRepository.deleteById(groupId);

    return { id: groupId };
  },

  async moveGroupToAnotherSection(
    groupId: string,
    sectionId: string,
  ): Promise<Group> {
    const updated = await GroupRepository.updateSectionId(groupId, sectionId);
    if (!updated) {
      throw HttpError.notFound("Group not found");
    }
    return updated;
  },
};

export { GroupService };
