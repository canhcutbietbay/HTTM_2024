import { sql, connect } from './index.js'
import { CustomError } from '../utils/error.js';
import validator from 'validator';

const findAll = async function () {
    const pool = await connect;
    const data = await pool.request().query("select * from recipesGetAll")
    return (data.recordset)
}

const findOne = async function (id) {
    if (validator.isUUID(id)) {
        const pool = await connect;
        const data = await pool.request().input('id', sql.UniqueIdentifier, id).execute("recipeGetDetail")
        return (data.recordset)
    }
    else {
        throw new CustomError("ID not valid", 400)
    }
}

const create = async function (name, instruction, image_url,
    video_url, category, tags, cuisine_id, user_id, ingredientsJson) {
    if (!validator.isUUID(cuisine_id))
        throw new CustomError("cuisine_id error", 400)
    if (!validator.isUUID(user_id))
        throw new CustomError("user_id error", 400)
    if (!validator.isURL(image_url))
        throw new CustomError("image_url error", 400)
    if (!validator.isURL(video_url))
        throw new CustomError("video_url error", 400)
    const pool = await connect;
    const data = await pool.request()
        .input('name', sql.NVarChar, name)
        .input('instruction', sql.NText, instruction)
        .input('image_url', sql.NVarChar, image_url)
        .input('video_url', sql.NVarChar, video_url)
        .input('category', sql.NVarChar, category)
        .input('tags', sql.NVarChar, tags)
        .input('cuisine_id', sql.UniqueIdentifier, cuisine_id)
        .input('user_id', sql.UniqueIdentifier, user_id)
        .input('ingredientsJson', sql.NVarChar, ingredientsJson)
        .execute("postCreateNew")
    return (data.recordset)
}

const recipeDeleteById = async function (recipe_id) {
    if (!validator.isUUID(recipe_id))
        throw new CustomError("recipe_id error", 400)
    const pool = await connect;
    const data = await pool.request()
        .input('recipe_id', sql.UniqueIdentifier, recipe_id)
        .execute("recipeDeleteById")
    return (data.returnValue)
}

const postUserFindByRecipeId = async function name(recipe_id) {
    if (!validator.isUUID(recipe_id))
        throw new CustomError("recipe_id error", 400)
    const pool = await connect;
    const data = await pool.request()
        .input('recipe_id', sql.UniqueIdentifier, recipe_id)
        .execute("postUserFindByRecipeId")
    return (data.recordset)
}

export {
    findAll, findOne,
    create, recipeDeleteById, postUserFindByRecipeId
}
