import * as ingredients from "../db/ingredientsDB.js"
import { asyncHandlerError } from "../utils/error.js";

const get = asyncHandlerError(async function (req, res, next) {
    const data = await ingredients.findAll();
    res.json(data)
}
)

const getId = asyncHandlerError(async function (req, res, next) {
    const data = await ingredients.findOne(req.params.id);
    res.json(data)
}
)

const create = asyncHandlerError(async function (req, res, next) { })


export {
    get, getId, create
}