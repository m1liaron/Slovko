type IGroup = {
  id: string;
  title: string;
  userId?: string;
  sectionId: string;
  toLearnCount?: number;
  repeatedCount?: number;
  knowCount?: number;
  learnedCount?: number;
};

export type { IGroup };
