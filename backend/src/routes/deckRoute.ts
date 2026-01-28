import { getDecks, getDeck } from "../controllers/deckController.js";

import { authRouter } from "./authRoute.js";

const { router, get } = authRouter();

get("/", getDecks);
get("/:deckId", getDeck);

export { router as deckRoute };
