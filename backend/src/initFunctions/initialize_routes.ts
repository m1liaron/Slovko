import { Application } from "express";
import {
    userRoute,
    cardRoute,
    groupRoute,
    resultRoute,
    sharedGroupRoute,
    languageRoute,
    sectionRoute,
} from "../modules/index";
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