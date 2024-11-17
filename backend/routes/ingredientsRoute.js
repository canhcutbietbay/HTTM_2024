import { Router } from "express";
import * as ingredientsController from "../controller/ingredientsController.js"

const route = Router()

route.get("/ingredients", ingredientsController.get)

route.get("/ingredients/:id", ingredientsController.getId)

route.post("/ingredients", ingredientsController.create)

export default route