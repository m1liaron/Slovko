import {
    createSharedGroup,
    getAllSharedGroups,
    getSharedGroup,
    copySharedGroup,
    removeSharedGroup,
} from "./shared-group.controller";
import { asyncHandler, validate, verifyOwnership } from "@/middlewares/index";
import {
    copySharedGroupSchema,
    createSharedGroupSchema,
    getAllSharedGroupsSchema,
    getSharedGroupSchema,
    removeSharedGroupSchema,
} from "./shared-group.schema";

import { authRouter } from "@/libs/modules/route/index";

const { router, get, post, delete: remove } = authRouter();

get("/", validate(getAllSharedGroupsSchema), asyncHandler(getAllSharedGroups));
post("/", validate(createSharedGroupSchema), asyncHandler(createSharedGroup));

get(
    "/:sharedGroupId",
    validate(getSharedGroupSchema),
    asyncHandler(getSharedGroup),
);
post(
    "/:sharedGroupId",
    validate(copySharedGroupSchema),
    asyncHandler(copySharedGroup),
);
remove(
    "/:sharedGroupId",
    verifyOwnership("sharedGroup"),
    validate(removeSharedGroupSchema),
    asyncHandler(removeSharedGroup),
);

export { router as sharedGroupRoute };
