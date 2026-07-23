type SharedGroupsQuery = {
  month: string;
  year: string;
  page?: string;
  limit?: string;
};

type CreateSharedGroupBody = {
  groupId: string;
  title?: string;
  isAnonymous: boolean;
};

type CopySharedGroupBody = {
  sectionId?: string;
};

export {
  type SharedGroupsQuery,
  type CreateSharedGroupBody,
  type CopySharedGroupBody,
};
