import { SharedGroup } from "./shared-group.model";

const SharedGroupService = {
    toSafeSharedGroup (group: SharedGroup & { user?: unknown }) {
        const { user, ...rest } = group;
        return group.isAnonymous ? rest : group;
    }
}

export { SharedGroupService }