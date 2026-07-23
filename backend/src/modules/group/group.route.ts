import { authRouter } from "@/libs/modules/route/auth.route.js";
import {
    getAllGroups,
    addGroup,
    removeGroup,
    getGroup,
    updateGroup,
    moveGroupToAnotherSection,
} from "./group.controller";
import {
    addGroupSchema,
    getAllGroupsSchema,
    getGroupSchema,
    removeGroupSchema,
    updateGroupSchema,
} from "./group.schema.js";
import { verifyOwnership, validate, asyncHandler } from "@/middlewares";

const { router, get, post, patch, delete: remove, put } = authRouter();

get(
    "/section/:sectionId",
    validate(getAllGroupsSchema),
    verifyOwnership("section", {
        param: "sectionId",
    }),
    asyncHandler(getAllGroups),
);
post("/", validate(addGroupSchema), asyncHandler(addGroup));

get(
    "/:id",
    verifyOwnership("group"),
    validate(getGroupSchema),
    asyncHandler(getGroup),
);
patch(
    "/:id",
    verifyOwnership("group"),
    validate(updateGroupSchema),
    asyncHandler(updateGroup),
);
put(
    "/:id/section/:sectionId",
    verifyOwnership("group"),
    validate(updateGroupSchema),
    asyncHandler(moveGroupToAnotherSection),
);

remove(
    "/:id",
    verifyOwnership("group"),
    validate(removeGroupSchema),
    asyncHandler(removeGroup),
);

export { router as groupRoute };
