const ApiPath = {
  AUTH: {
    Register: "/register",
    Login: "/login",
  },
  USER: {
    GET_USER: "/me/:id",
    GET_USERS: "/",
    POST_USER: "/",
    UPDATE_USER: "/",
  },
  SECTION: {
    GET_SECTION: "/:id",
    GET_SECTIONS: "/",
    POST_SECTION: "/",
    UPDATE_SECTION: "/:id",
    DELETE_SECTION: "/:id",
  },
  GROUP: {
    GET_GROUP: "/:id",
    GET_GROUPS: "/:sectionId",
    POST_GROUP: "/",
    UPDATE_GROUP: "/:id",
    DELETE_GROUP: "/:id",
    MOVE_GROUP: "/move/:id",
  },
  Card: {
    GET_CARD: "/:id",
    GET_CARDS: "/:groupId",
    POST_CARD: "/",
    UPDATE_CARD: "/:id",
    DELETE_CARD: "/:id",
  },
} as const;

export { ApiPath };
