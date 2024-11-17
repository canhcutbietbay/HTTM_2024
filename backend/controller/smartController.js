import * as smartDB from "../db/smartDB.js";
import { asyncHandlerError, ErrInternalServer } from "../utils/error.js";
import { decode_jwt } from "../utils/auth.js"
import itemBaseCF from "../smart/item_base_cf.js"
import userBaseCF from "../smart/user_base_cf.js"
import contentRecomend from "../smart/content_base.js"


const getItemBase = async function (userRecipe, recipes, ingredients_array, categorys_array, areas_array) {
    if (userRecipe.length !== 0)
        return await itemBaseCF(userRecipe, recipes, ingredients_array, categorys_array, areas_array)
    else return []
}
const getUserBase = async function (userRecipeIds, recipesByUser, recipes, ingredients_array, categorys_array, areas_array, userRecipe) {
    if (userRecipeIds.length == 0)
        return []
    const userBaseID = await userBaseCF(userRecipeIds, recipesByUser, recipes)
    const userBaseIdRecipe = await smartDB.userGetFavoAndSaveRecipeIngredients(userBaseID) // get all userBase favorite, save recipe
    const userBase = await getItemBase(userRecipe, userBaseIdRecipe, ingredients_array, categorys_array, areas_array)
    return userBase.map(({ Id_recipe, ...rest }) => ({
        ...rest,
        Id: Id_recipe, // Đổi tên thành Id
    }));
}
const getContentBase = async function (userContent, recipes) {
    if (userContent.length === 0)
        return []
    else return await contentRecomend(userContent, recipes)
}

const get = asyncHandlerError(async (req, res, next) => {
    // init value
    const ingredients_array = []
    const areas_array = []
    const categorys_array = []
    const user_id = decode_jwt(req.cookies.jwt).data //current login user id

    // get from db 
    const userRecipe = await smartDB.userGetFavoAndSaveRecipeIngredients(user_id) // get all favorite, save recipe
    const ingredients = await smartDB.ingredientsGetAll() // all ingredient for item base
    const recipes = await smartDB.recipesGetAll() // all recipes for item base
    const recipes2 = await smartDB.recipesGetAll() // all recipes for item base
    const areas = await smartDB.areaGetAll() // all areas for item base
    const categorys = await smartDB.categoryGetAll() // all category for item base
    const allUserFavoAndSave = await smartDB.userAllGetFavoAndSaveRecipe() // all user favorite, save recipe data for user base
    const user_recipe_id = await smartDB.userGetFavoAndSaveRecipeId(user_id) // all recipe_id user favorite and save
    const userSearchHistory = await smartDB.historyFindByID(user_id);
    const cuisineUserSave = await smartDB.cuisineUserFindById(user_id)

    // handle object
    ingredients.forEach(element => {
        if (ingredients_array.includes(element.Name) == false && element.Name != '') ingredients_array.push(String(element.Name).trim())
    })
    areas.forEach(element => {
        if (areas_array.includes(element.Category) == false && element.Category != '') areas_array.push(String(element.Category).trim())
    })
    categorys.forEach(element => {
        if (categorys_array.includes(element.Area) == false && element.Area != '') categorys_array.push(String(element.Area).trim())
    })
    const recipesByUser = allUserFavoAndSave.map(user => {
        const recipes = user.recipes ? JSON.parse(user.recipes) : [];
        return {
            user_id: user.user_id,
            recipe_ids: recipes.map(recipe => recipe.Id_recipe)
        };
    });
    const userRecipeIds = user_recipe_id.map(recipe => recipe.Id_recipe);
    const userHistory = userSearchHistory.map(e => e.Text)
    const cuisineUser = cuisineUserSave.map(e => e.Area)

    // process
    const itemBase = await getItemBase(userRecipe, recipes, ingredients_array, categorys_array, areas_array) // item base cf
    const userBase = await getUserBase(userRecipeIds, recipesByUser, recipes, ingredients_array, categorys_array, areas_array, userRecipe) // user base cf
    const contentBase = await getContentBase([...userHistory, ...cuisineUser], recipes2) // content_base

    // result
    const mergedArray = [...itemBase, ...userBase, ...contentBase];
    const uniqueArray = [
        ...new Map(mergedArray.map(item => [item.Id, item])).values()
    ];
    const result = []
    for (const element of uniqueArray) {
        const data = await smartDB.recipesFindByID(element.Id)
        result.push(data[0])
    }
    if (result.length == uniqueArray.length)
        res.json(result)
    else throw ErrInternalServer
})

export {
    get
}