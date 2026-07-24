export {
    createSharedGroupSchema,
    getAllSharedGroupsSchema,
    getSharedGroupSchema,
    removeSharedGroupSchema,
    copySharedGroupSchema,

    type CreateSharedGroupInput,
    type GetAllSharedGroupsInput,
    type GetSharedGroupInput,
    type RemoveSharedGroupInput,
    type CopySharedGroupInput,
} from "./shared-group.schema"

export { sharedGroupRoute } from "./shared-group.route";

export {
    createSharedGroup,
    getAllSharedGroups,
    getSharedGroup,
    copySharedGroup,
    removeSharedGroup,
} from "./shared-group.controller";
