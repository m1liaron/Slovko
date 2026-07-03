
const { router } = authRouter();
import { authRouter } from "@/libs/modules/route";
import { getLanguages } from "./language.controller";

router.route("/").get(getLanguages);

export { router as languageRoute };
