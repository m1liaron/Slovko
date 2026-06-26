import {
    createSharedGroup,
    getAllSharedGroups,
    getSharedGroup,
    copySharedGroup,
    removeSharedGroup,
} from "./sharedGroup.controller";
import { asyncHandler, validate, verifyOwnership } from "@/middlewares/index";
import { SharedGroup } from "./sharedGroup.model";
import {
    copySharedGroupSchema,
    createSharedGroupSchema,
    getAllSharedGroupsSchema,
    getSharedGroupSchema,
    removeSharedGroupSchema,
} from "./sharedGroup.schema";

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
    verifyOwnership("sharedGroup", {
        Model: SharedGroup,
    }),
    validate(removeSharedGroupSchema),
    asyncHandler(removeSharedGroup),
);

export { router as sharedGroupRoute };
