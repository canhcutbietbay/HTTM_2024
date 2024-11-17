import { Router } from "express";
import * as recipesController from "../controller/recipesController.js"
import { requireAuth } from "../middleware/authMiddleware.js";

const route = Router()

route.get("/recipes", recipesController.get)

route.get("/recipes/:id", recipesController.getId)

route.post("/recipes", requireAuth, recipesController.create)

route.delete("/recipes/:id", requireAuth, recipesController.deleteRecipe)

export default route