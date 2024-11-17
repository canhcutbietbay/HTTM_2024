import { sql, connect } from './index.js'

const ingredientsGetAll = async function () {
    const pool = await connect;
    const data = await pool.request().query(" select Name from Ingredients")
    return (data.recordset)
}

const recipesGetAll = async function () {
    const pool = await connect;
    const data = await pool.request().query(" select Id, Name, Ingredients, Category, Area from recipesGetAll")
    return (data.recordset)
}
const userGetFavoAndSaveRecipeIngredients = async function (user_id) {
    const pool = await connect;
    const data = await pool.request()
        .input('user_id', sql.UniqueIdentifier, user_id)
        .execute("userGetFavoAndSaveRecipeIngredients")
    return (data.recordset)
}

const areaGetAll = async function () {
    const pool = await connect;
    const data = await pool.request().query(" select distinct Category from Recipes")
    return (data.recordset)
}

const categoryGetAll = async function () {
    const pool = await connect;
    const data = await pool.request().query(" select Area from Cuisine")
    return (data.recordset)
}

const userGetFavoAndSaveRecipeId = async function (user_id) {
    const pool = await connect;
    const data = await pool.request()
        .input('user_id', sql.UniqueIdentifier, user_id)
        .execute("userGetFavoAndSaveRecipeId")
    return (data.recordset)
}
const userAllGetFavoAndSaveRecipe = async function () {
    const pool = await connect;
    const data = await pool.request().query(" select * from userAllGetFavoAndSaveRecipe")
    return (data.recordset)
}

const recipesFindByID = async function (id) {
    const pool = await connect;
    const data = await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .execute("recipesFindByID")
    return (data.recordset)
}

const historyFindByID = async function (id) {
    const pool = await connect;
    const data = await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .execute("historyFindByID")
    return (data.recordset)
}

const cuisineUserFindById = async function (id) {
    const pool = await connect;
    const data = await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .execute("cuisineUserFindById")
    return (data.recordset)
}

export {
    ingredientsGetAll, recipesGetAll,
    userGetFavoAndSaveRecipeIngredients, areaGetAll, categoryGetAll,
    userGetFavoAndSaveRecipeId, userAllGetFavoAndSaveRecipe,
    recipesFindByID, historyFindByID, cuisineUserFindById

}