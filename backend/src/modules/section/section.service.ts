import { HttpError } from "@/libs/constants";
import { GroupRepository } from "@/modules/group/group.repository";

import type { NewSection, Section } from "./section.model";
import { SectionRepository } from "./section.repository";

const SectionService = {
  async getAllSections(userId: string) {
    return SectionRepository.findAllByUser(userId);
  },

  async addSection(
    userId: string,
    data: { title?: string; languageId?: string },
  ) {
    if (data.title || data.languageId) {
      const existing = await SectionRepository.findOne({
        title: data.title,
        languageId: data.languageId,
        userId,
      });
      if (existing) {
        throw HttpError.badRequest("Section already exists");
      }
    }

    const newSection = await SectionRepository.create({
      title: data.title!,
      languageId: data.languageId,
      userId,
    });

    if (data.languageId) {
      const withLanguage = await SectionRepository.findByLanguageAndUser(
        data.languageId,
        userId,
      );
      return withLanguage ?? newSection;
    }

    return newSection;
  },

  async updateSection(
    sectionId: string,
    userId: string,
    data: Partial<NewSection>,
  ): Promise<Section> {
    const updated = await SectionRepository.updateByIdAndUser(
      sectionId,
      userId,
      data,
    );
    if (!updated) {
      throw HttpError.notFound("Section not found");
    }
    return updated;
  },

  async removeSection(
    sectionId: string,
    userId: string,
  ): Promise<{ id: string }> {
    const section = await SectionRepository.findByIdAndUser(sectionId, userId);
    if (!section) {
      throw HttpError.notFound("Section not found");
    }

    await GroupRepository.deleteBySectionId(section.id);
    await SectionRepository.deleteById(section.id);

    return { id: section.id };
  },
};

export { SectionService };
