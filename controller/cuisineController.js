import * as cuisine from "../db/cuisineDB.js"
import { asyncHandlerError } from "../utils/error.js";
import { decode_jwt } from "../utils/auth.js";
import { CustomError } from "../utils/error.js";

const get = asyncHandlerError(async function (req, res, next) {
    const data = await cuisine.findAll();
    res.json(data)
}
)

const getId = asyncHandlerError(async function (req, res, next) {
    const data = await cuisine.findOne(req.params.id);
    res.json(data)
}
)

const create = asyncHandlerError(async function (req, res, next) { })

const cusineUser = asyncHandlerError(async function (req, res, next) {
    const { cusine_id } = req.query
    const user_id = decode_jwt(req.cookies.jwt).data
    if (!cusine_id) throw new CustomError("Missing cusine_id", 400)
    // check exits 
    const data = await cuisine.findCusineUserByRecipeAndUserID(cusine_id, user_id)
    if (data.length === 0) {
        const { recordset, returnValue } = await cuisine.cusineUser(cusine_id, user_id)
        if (returnValue === 0) {
            res.status(201).send(recordset)
        } else throw ErrInternalServer
    }
    else throw new CustomError("Already have this cusine user", 400)
})

const unCusineUser = asyncHandlerError(async function (req, res, next) {
    const { cusine_id } = req.query
    const user_id = decode_jwt(req.cookies.jwt).data
    if (!cusine_id) throw new CustomError("Missing cusine_id", 400)
    // check exits 
    const data = await cuisine.findCusineUserByRecipeAndUserID(cusine_id, user_id)
    if (data.length === 1) {
        const returnValue = await cuisine.cuisineUserDelete(cusine_id, user_id)
        if (returnValue === 0) {
            res.status(200).send("success")
        } else throw ErrInternalServer
    }
    else throw new CustomError("Not found cusine user", 404)
})

export {
    get, getId, create,
    cusineUser, unCusineUser
}