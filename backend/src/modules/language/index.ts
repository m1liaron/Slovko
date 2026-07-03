export {
    registerSchema,
    loginSchema,
    buyFreezeSchema,
} from "./language.schema"

export { languageRoute } from "./language.route";

export {
    getLanguages
} from "./language.controller";

export {
    languages,
    type Language,
    type NewLanguage
} from "./language.model";