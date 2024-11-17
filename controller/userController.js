import * as userDB from "../db/userDB.js"
import { asyncHandlerError, CustomError, ErrInternalServer, ErrInvalidRequest } from "../utils/error.js";
import { createToken, decode_jwt } from "../utils/auth.js"
import validator from "validator"
import { hashPass, comparePass } from "../utils/bcrypt.js"

// time life jwt token
const maxAge = 24 * 60 * 60 // 1 day
const accountType = {
    google: "google",
    facebook: "facebook",
    default: "default"
}
const login = asyncHandlerError(async (req, res, next) => {
    const { email, type } = req.body
    if (!email) throw new CustomError("Missing email", 400)
    if (!type) throw new CustomError("Missing type", 400)
    const data = await userDB.findByEmail(email)
    if (data.length == 0) { // find 0 account
        if (type == accountType.facebook || type == accountType.google) {
            const { recordset, returnValue } = await userDB.create(email, email, password, type) // create new
            if (returnValue !== 0) throw ErrInternalServer // error create new account
            else { // create new account -> login
                const userID = recordset[0].Id
                const jwtToken = await createToken(userID, maxAge)
                res.cookie('jwt', jwtToken, {
                    path: "/",
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    maxAge: 24 * 60 * 60 * 1000,
                })
                res.status(200).send("Login success")
            }
        } else throw new CustomError("Need signUp first", 400) // don't have account
    } else { // find 1 account
        const userID = await data[0].Id
        const userType = await data[0].Type
        const userHassPassword = await data[0].Password
        if (type != userType) throw new CustomError("Type account not match", 400)
        if (type == accountType.facebook || type == accountType.google) {
            const jwtToken = await createToken(userID, maxAge)
            res.cookie('jwt', jwtToken, {
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.status(200).send("Login success")
        } else
            if (type == accountType.default) {
                const { password } = req.body
                if (!password) throw new CustomError("Missing password", 400)
                // get hashPass then compare
                const flag = await comparePass(password, userHassPassword)
                if (flag) {
                    const jwtToken = await createToken(userID, maxAge)
                    res.cookie('jwt', jwtToken, {
                        path: "/",
                        httpOnly: true,
                        secure: true,
                        sameSite: 'None',
                        maxAge: 24 * 60 * 60 * 1000,
                    });
                    res.status(200).send("Login success")
                } else throw new CustomError("Password not correct", 400)
            } else
                throw ErrInvalidRequest
    }
})
// default signUp
const signUp = asyncHandlerError(async (req, res, next) => {
    const { email, type, password } = req.body
    if (!email) throw new CustomError("Missing email", 400)
    if (!type) throw new CustomError("Missing type", 400)
    if (!password) throw new CustomError("Missing password", 400)
    const data = await userDB.findByEmail(email) // check exits email

    if (data.length === 0) {
        if (validator.isStrongPassword(password, {  // <-- with a symbol
            minLength: 8,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            const hash = await hashPass(password)
            const { recordset, returnValue } = await userDB.create(email, email, hash, type)
            if (returnValue === 0) res.status(201).send(recordset[0].Id)
            else throw ErrInternalServer
        }
        else throw new CustomError("Password not strong", 400)
    } else throw new CustomError("Email already using", 400)

})

const logout = (req, res, next) => {
    res.cookie('jwt', "", {
        path: "/",
        httpOnly: false,
        secure: true,
        sameSite: 'None',
        maxAge: 1,
    })
    res.send("Logout sucess")
}

const comment = asyncHandlerError(async (req, res, next) => {
    const { recipe_id, text } = req.body
    const user_id = decode_jwt(req.cookies.jwt).data
    if (!recipe_id) throw new CustomError("Missing recipe_id", 400)
    if (!text) throw new CustomError("Missing text", 400)
    const { recordset, returnValue } = await userDB.comment(recipe_id, user_id, text)
    if (returnValue === 0) {
        res.status(201).send(recordset)
    } else throw ErrInternalServer
})

const deleteComment = asyncHandlerError(async (req, res, next) => {
    const { comment_id } = req.query
    const user_id = decode_jwt(req.cookies.jwt).data
    if (!comment_id) throw new CustomError("Missing comment_id", 400)
    const recordset = await userDB.commentGetUserIdByCommentID(comment_id)
    if (recordset.length != 0) {
        const queryUserId = recordset[0].Id_user
        if (user_id != queryUserId) throw new CustomError("You can't do that", 400)
        else {
            // check exits 
            const returnValue = await userDB.deleteComment(comment_id, user_id)
            if (returnValue == 0) res.status(200).send("success")
            else throw ErrInternalServer
        }
    } else throw new CustomError("Comment ID not exits", 400)
})

const favorite = asyncHandlerError(async (req, res, next) => {
    const { recipe_id } = req.query
    const user_id = decode_jwt(req.cookies.jwt).data
    if (!recipe_id) throw new CustomError("Missing recipe_id", 400)
    // check exits 
    const data = await userDB.favoriteFindByRecipeAndUserID(recipe_id, user_id) // not favorite yet
    if (data.length === 0) {
        const { recordset, returnValue } = await userDB.favorite(recipe_id, user_id)
        if (returnValue === 0) {
            res.status(201).send(recordset)
        } else throw ErrInternalServer
    }
    else throw new CustomError("Favorited", 400)
})

const unFavorite = asyncHandlerError(async (req, res, next) => {
    const { recipe_id } = req.query
    const user_id = decode_jwt(req.cookies.jwt).data
    if (!recipe_id) throw new CustomError("Missing recipe_id", 400)
    // check exits 
    const data = await userDB.favoriteFindByRecipeAndUserID(recipe_id, user_id)
    if (data.length === 1) {
        const returnValue = await userDB.favoriteDeleteByRecipeAndUserID(recipe_id, user_id)
        if (returnValue === 0) {
            res.status(200).send("success")
        } else throw ErrInternalServer
    }
    else throw new CustomError("You must favorited first", 404)
})

const save = asyncHandlerError(async (req, res, next) => {
    const { recipe_id } = req.query
    const user_id = decode_jwt(req.cookies.jwt).data
    if (!recipe_id) throw new CustomError("Missing recipe_id", 400)
    // check exits 
    const data = await userDB.saveFindByRecipeAndUserID(recipe_id, user_id)
    if (data.length === 0) {
        const { recordset, returnValue } = await userDB.save(recipe_id, user_id)
        if (returnValue === 0) {
            res.status(201).send(recordset)
        } else throw ErrInternalServer
    }
    else throw new CustomError("Saved", 400)
})

const unSave = asyncHandlerError(async (req, res, next) => {
    const { recipe_id } = req.query
    const user_id = decode_jwt(req.cookies.jwt).data
    if (!recipe_id) throw new CustomError("Missing recipe_id", 400)
    // check exits 
    const data = await userDB.saveFindByRecipeAndUserID(recipe_id, user_id)
    if (data.length === 1) {
        const returnValue = await userDB.saveDeleteByRecipeAndUserID(recipe_id, user_id)
        if (returnValue === 0) {
            res.status(200).send("success")
        } else throw ErrInternalServer
    }
    else throw new CustomError("You must saved first", 404)
})

const historyGetAllByUserID = asyncHandlerError(async (req, res, next) => {
    const user_id = decode_jwt(req.cookies.jwt).data
    const data = await userDB.historyGetAllByUserID(user_id)
    res.json(data)
})

const historyCreateNew = asyncHandlerError(async (req, res, next) => {
    const user_id = decode_jwt(req.cookies.jwt).data
    const { search_term } = req.query
    if (!search_term) throw new CustomError("Missing search_term", 400)
    const { recordset, returnValue } = await userDB.historyCreateNew(search_term, user_id)
    if (returnValue == 0)
        res.status(200).send(recordset)
    else throw ErrInternalServer
})

const deleteHistoryById = asyncHandlerError(async (req, res, next) => {
    const user_id = decode_jwt(req.cookies.jwt).data
    const { id } = req.params
    if (!id) throw new CustomError("Missing id", 400)
    const recordset = await userDB.historyGetUserIdByHistoryID(id)
    if (recordset.length != 0) {
        const queryUserId = recordset[0].Id_user
        if (user_id != queryUserId) throw new CustomError("You can't do that", 400)
        else {
            // check exits 
            const returnValue = await userDB.historyDeleteByID(id)
            if (returnValue == 0) res.status(200).send("success")
            else throw ErrInternalServer
        }
    } else throw new CustomError("History ID not exits", 400)

})

const deleteAllHistory = asyncHandlerError(async (req, res, next) => {
    const user_id = decode_jwt(req.cookies.jwt).data
    const returnValue = await userDB.historyDeleteAllByUserID(user_id)
    if (returnValue == 0) res.status(200).send("success")
    else throw ErrInternalServer
})

const userGetProfile = asyncHandlerError(async (req, res, next) => {
    const user_id = decode_jwt(req.cookies.jwt).data
    const data = await userDB.userGetProfile(user_id)
    res.json(data)
})

export {
    login, signUp, logout,
    comment, deleteComment,
    favorite, unFavorite, save, unSave,
    historyGetAllByUserID, historyCreateNew, deleteHistoryById, deleteAllHistory,
    userGetProfile
}