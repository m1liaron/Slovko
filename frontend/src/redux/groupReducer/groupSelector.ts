import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../store';

const selectSectionGroups = createSelector(
  [
    (state: RootState) => state.groups.groups,
    (state: RootState) => state.sections.activeSection,
  ],
  (groups, activeSection) => {
    const sectionGroups = groups.filter(
      (group) => group.sectionId === activeSection?.id,
    );

    return sectionGroups;
  },
);

export { selectSectionGroups };
