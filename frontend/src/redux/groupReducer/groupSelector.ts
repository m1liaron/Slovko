import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectSectionGroups = createSelector(
  [
    (state: RootState) => state.groups.groups,
    (state: RootState) => state.sections.activeSectionId,
  ],
  (groups, activeSectionId) => {
    const sectionGroups = groups.filter(
      (group) => group.sectionId === activeSectionId,
    );

    return sectionGroups;
  },
);

export { selectSectionGroups };
