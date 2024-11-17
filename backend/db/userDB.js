import { sql, connect } from './index.js'
import validator from 'validator';
import { CustomError } from '../utils/error.js';

const findByEmail = async function (email) {
    if (validator.isEmail(email)) {
        const pool = await connect;
        const data = await pool.request().input('email', sql.NVarChar, email).execute("userFindByEmail")
        return (data.recordset)
    }
    else {
        throw new CustomError("Email not valid", 400)
    }
}

const create = async function (displayName, email, password, type,) {
    if (!validator.isEmail(email))
        throw new CustomError("Email not valid", 400)
    else {
        const pool = await connect;
        const data = await pool.request()
            .input('displayName', sql.NVarChar, displayName)
            .input('email', sql.NVarChar, email)
            .input('password', sql.VarChar, password)
            .input('type', sql.VarChar, type)
            .execute("userCreateNew")
        return {
            "recordset": data.recordset,
            "returnValue": data.returnValue
        }
    }
}

const findById = async function (id) {
    if (validator.isUUID(id)) {
        const pool = await connect;
        const data = await pool.request().input('id', sql.UniqueIdentifier, id).execute("userFindById")
        return (data.recordset)
    }
    else {
        throw new CustomError("ID not valid", 400)
    }
}

const comment = async function (recipe_id, user_id, text) {
    if (!validator.isUUID(recipe_id))
        throw new CustomError("recipe_id error")
    if (!validator.isUUID(user_id))
        throw new CustomError("user_id error")
    const pool = await connect;
    const data = await pool.request()
        .input('recipe_id', sql.UniqueIdentifier, recipe_id)
        .input('user_id', sql.UniqueIdentifier, user_id)
        .input('text', sql.NText, text)
        .execute("commentCreateNew")
    return {
        "recordset": data.recordset,
        "returnValue": data.returnValue
    }
}

const favorite = async function (recipe_id, user_id) {
    if (!validator.isUUID(recipe_id))
        throw new CustomError("recipe_id error")
    if (!validator.isUUID(user_id))
        throw new CustomError("user_id error")
    const pool = await connect;
    const data = await pool.request()
        .input('recipe_id', sql.UniqueIdentifier, recipe_id)
        .input('user_id', sql.UniqueIdentifier, user_id)
        .execute("favoriteCreateNew")
    return {
        "recordset": data.recordset,
        "returnValue": data.returnValue
    }
}

const favoriteFindByRecipeAndUserID = async function (recipe_id, user_id) {
    if (!validator.isUUID(recipe_id))
        throw new CustomError("recipe_id error")
    if (!validator.isUUID(user_id))
        throw new CustomError("user_id error")
    const pool = await connect;
    const data = await pool.request()
        .input('recipe_id', sql.UniqueIdentifier, recipe_id)
        .input('user_id', sql.UniqueIdentifier, user_id)
        .execute("favoriteFindByRecipeAndUserID")
    return data.recordset
}

const favoriteDeleteByRecipeAndUserID = async function (recipe_id, user_id) {
    if (!validator.isUUID(recipe_id))
        throw new CustomError("recipe_id error")
    if (!validator.isUUID(user_id))
        throw new CustomError("user_id error")
    const pool = await connect;
    const data = await pool.request()
        .input('recipe_id', sql.UniqueIdentifier, recipe_id)
        .input('user_id', sql.UniqueIdentifier, user_id)
        .execute("favoriteDeleteByRecipeAndUserID")
    return data.returnValue
}

const save = async function (recipe_id, user_id) {
    if (!validator.isUUID(recipe_id))
        throw new CustomError("recipe_id error")
    if (!validator.isUUID(user_id))
        throw new CustomError("user_id error")
    const pool = await connect;
    const data = await pool.request()
        .input('recipe_id', sql.UniqueIdentifier, recipe_id)
        .input('user_id', sql.UniqueIdentifier, user_id)
        .execute("saveCreateNew")
    return {
        "recordset": data.recordset,
        "returnValue": data.returnValue
    }
}

const saveFindByRecipeAndUserID = async function (recipe_id, user_id) {
    if (!validator.isUUID(recipe_id))
        throw new CustomError("recipe_id error")
    if (!validator.isUUID(user_id))
        throw new CustomError("user_id error")
    const pool = await connect;
    const data = await pool.request()
        .input('recipe_id', sql.UniqueIdentifier, recipe_id)
        .input('user_id', sql.UniqueIdentifier, user_id)
        .execute("saveFindByRecipeAndUserID")
    return data.recordset
}

const saveDeleteByRecipeAndUserID = async function (recipe_id, user_id) {
    if (!validator.isUUID(recipe_id))
        throw new CustomError("recipe_id error")
    if (!validator.isUUID(user_id))
        throw new CustomError("user_id error")
    const pool = await connect;
    const data = await pool.request()
        .input('recipe_id', sql.UniqueIdentifier, recipe_id)
        .input('user_id', sql.UniqueIdentifier, user_id)
        .execute("saveDeleteByRecipeAndUserID")
    return data.returnValue
}
const commentGetUserIdByCommentID = async function (comment_id) {
    if (!validator.isUUID(comment_id))
        throw new CustomError("comment_id error")
    const pool = await connect;
    const data = await pool.request()
        .input('comment_id', sql.UniqueIdentifier, comment_id)
        .execute("commentGetUserIdByCommentID")
    return data.recordset
}
const deleteComment = async function (comment_id, user_id) {
    if (!validator.isUUID(comment_id))
        throw new CustomError("comment_id error")
    if (!validator.isUUID(user_id))
        throw new CustomError("user_id error")
    const pool = await connect;
    const data = await pool.request()
        .input('comment_id', sql.UniqueIdentifier, comment_id)
        .execute("commentDeleteByID")
    return data.returnValue
}

const historyCreateNew = async function (search_term, user_id) {
    if (!validator.isUUID(user_id))
        throw new CustomError("user_id error")
    const pool = await connect;
    const data = await pool.request()
        .input('search_term', sql.NText, search_term)
        .input('user_id', sql.UniqueIdentifier, user_id)
        .execute("historyCreateNew")
    return {
        "recordset": data.recordset,
        "returnValue": data.returnValue
    }
}

const historyGetAllByUserID = async function (user_id) {
    if (!validator.isUUID(user_id))
        throw new CustomError("user_id error")
    const pool = await connect;
    const data = await pool.request()
        .input('user_id', sql.UniqueIdentifier, user_id)
        .execute("historyGetAllByUserID")
    return data.recordset
}

const historyDeleteByID = async function (id) {
    if (!validator.isUUID(id))
        throw new CustomError("id error")
    const pool = await connect;
    const data = await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .execute("historyDeleteByID")
    return data.returnValue
}

const historyGetUserIdByHistoryID = async function name(id) {
    if (!validator.isUUID(id))
        throw new CustomError("history_id error")
    const pool = await connect;
    const data = await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .execute("historyGetUserIdByHistoryID")
    return data.recordset
}

const historyDeleteAllByUserID = async function (user_id) {
    if (!validator.isUUID(user_id))
        throw new CustomError("user_id error")
    const pool = await connect;
    const data = await pool.request()
        .input('user_id', sql.UniqueIdentifier, user_id)
        .execute("historyDeleteAllByUserID")
    return data.returnValue
}

const userGetProfile = async function name(user_id) {
    if (!validator.isUUID(user_id))
        throw new CustomError("user_id error")
    const pool = await connect;
    const data = await pool.request()
        .input('user_id', sql.UniqueIdentifier, user_id)
        .execute("userGetProfile")
    return data.recordset
}

export {
    findByEmail, create, findById,
    comment, deleteComment, commentGetUserIdByCommentID,
    favorite, favoriteFindByRecipeAndUserID, favoriteDeleteByRecipeAndUserID,
    save, saveFindByRecipeAndUserID, saveDeleteByRecipeAndUserID,
    historyCreateNew, historyGetAllByUserID, historyDeleteByID,
    historyGetUserIdByHistoryID, historyDeleteAllByUserID,
    userGetProfile,
}
