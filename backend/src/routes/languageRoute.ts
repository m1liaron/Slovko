import { authRouter } from "./authRoute.js";
const { router } = authRouter();
import {} from "../controllers/cardsController.js";
import { getLanguages } from "../controllers/languageController.js";

router.route("/").get(getLanguages);

export { router as languageRoute };
