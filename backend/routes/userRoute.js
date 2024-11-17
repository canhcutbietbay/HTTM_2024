import { Router } from "express";
import * as userController from "../controller/userController.js"
import { requireAuth } from "../middleware/authMiddleware.js";


const route = Router()

route.post("/login", userController.login)

route.post("/signUp", userController.signUp)

route.get("/logout", userController.logout)

route.post("/comment", requireAuth, userController.comment)

route.delete("/comment", requireAuth, userController.deleteComment)

route.get("/favorite", requireAuth, userController.favorite)

route.delete("/favorite", requireAuth, userController.unFavorite)

route.get("/save", requireAuth, userController.save)

route.delete("/save", requireAuth, userController.unSave)

route.get("/history", requireAuth, userController.historyGetAllByUserID)

route.post("/history", requireAuth, userController.historyCreateNew)

route.delete("/history/:id", requireAuth, userController.deleteHistoryById)

route.delete("/history", requireAuth, userController.deleteAllHistory)

route.get("/profile", requireAuth, userController.userGetProfile)

export default route 