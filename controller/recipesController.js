import * as recipesDB from "../db/recipesDB.js"
import { asyncHandlerError, CustomError, ErrInternalServer } from "../utils/error.js";
import { decode_jwt } from "../utils/auth.js"


const get = asyncHandlerError(async function (req, res, next) {
    const data = await recipesDB.findAll();
    res.json(data)
}
)

const getId = asyncHandlerError(async function (req, res, next) {
    const data = await recipesDB.findOne(req.params.id);

    res.json(data)
}
)

const create = asyncHandlerError(async function (req, res, next) {
    const user_id = decode_jwt(req.cookies.jwt).data
    const { name, cuisine_id, category,
        instruction, image_url, video_url, tags, ingredients } = req.body
    // check if null value
    if (!name) throw new CustomError("Missing name", 400)
    if (!cuisine_id) throw new CustomError("Missing cuisine_id", 400)
    if (!category) throw new CustomError("Missing category", 400)
    if (!instruction) throw new CustomError("Missing instruction", 400)
    if (!image_url) throw new CustomError("Missing image_url", 400)
    if (!video_url) throw new CustomError("Missing video_url", 400)
    if (!tags) throw new CustomError("Missing tags", 400)
    if (!ingredients) throw new CustomError("Missing ingredients", 400)
    const data = await recipesDB.create(name, instruction, image_url,
        video_url, category, tags, cuisine_id, user_id, JSON.stringify(ingredients))
    res.json(data)
})

const deleteRecipe = asyncHandlerError(async function (req, res, next) {
    const user_id = decode_jwt(req.cookies.jwt).data
    const { id } = req.params
    if (!id) throw new CustomError("Missing recipe_id", 400)
    const post = await recipesDB.postUserFindByRecipeId(id)
    if (post.length == 1) {

        const user_post = post[0].Id_user
        if (user_post != user_id) throw new CustomError("You can't do that", 400);
        else {
            const returnValue = await recipesDB.recipeDeleteById(id)
            if (returnValue === 0)
                res.status(200).send("success")
            else throw ErrInternalServer
        }
    } else throw new CustomError("Not found recipe", 404)
})
export {
    get, getId,
    create, deleteRecipe
}