import { Application } from "express";
import { userRoute } from "../modules/user/index";
import { languageRoute } from "../modules/language/index";
import { groupRoute } from "../modules/group/index";
import { cardRoute } from "../modules/card/index";
import { resultRoute } from "../modules/result/index";
import { sharedGroupRoute } from "../modules/sharedGroup/index";
import { sectionRoute } from "../modules/section/index";


import { authMiddleware } from "@/middlewares";

const initializeRoutes = (app: Application) => {
    app.use("/users", userRoute);
    app.use("/languages", authMiddleware, languageRoute);
    app.use("/cards", authMiddleware, cardRoute);
    app.use("/groups", authMiddleware, groupRoute);
    app.use("/results", authMiddleware, resultRoute);
    app.use("/sharedGroups", authMiddleware, sharedGroupRoute);
    app.use("/sections", authMiddleware, sectionRoute);
}

export { initializeRoutes };