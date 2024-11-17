import { Router } from "express";
import recipeRoute from "./recipeRoute.js"
import cuisineRoute from "./cuisineRoute.js"
import ingredientsRoute from "./ingredientsRoute.js"
import userRoute from "./userRoute.js"
import smartRoute from "./smartRoute.js"
const route = Router()

route.use(recipeRoute)
route.use(cuisineRoute)
route.use(ingredientsRoute)
route.use(userRoute)
route.use(smartRoute)

export default route