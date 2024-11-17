import { Router } from "express";
import * as cuisineController from "../controller/cuisineController.js"
import { requireAuth } from "../middleware/authMiddleware.js";

const route = Router()

route.get("/cuisine", cuisineController.get)

route.get("/cuisine/:id", cuisineController.getId)

route.post("/cuisine", cuisineController.create)

route.get("/cusineUser", requireAuth, cuisineController.cusineUser)

route.delete("/cusineUser", requireAuth, cuisineController.unCusineUser)

export default route