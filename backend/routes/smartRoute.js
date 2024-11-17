import { Router } from "express";
import * as smartController from "../controller/smartController.js"
import { requireAuth } from "../middleware/authMiddleware.js";

const route = Router()

route.get("/smart", requireAuth, smartController.get)

export default route