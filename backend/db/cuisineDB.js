import { sql, connect } from './index.js'
import { CustomError } from '../utils/error.js';
import validator from 'validator';

const findAll = async function () {
    const pool = await connect;
    const data = await pool.request().query("select * from cuisine")
    return (data.recordset)
}

const findOne = async function (id) {
    if (validator.isUUID(id)) {
        const pool = await connect;
        const data = await pool.request().input('id', sql.UniqueIdentifier, id).execute("cuisineFindByID")
        return (data.recordset)
    }
    else {
        throw new CustomError("ID not valid", 400)
    }
}

const create = async function (params) { //create new cusine

}

const cusineUser = async function (cusine_id, user_id) {
    if (!validator.isUUID(cusine_id))
        throw new CustomError("cusine_id error")
    if (!validator.isUUID(user_id))
        throw new CustomError("user_id error")
    const pool = await connect;
    const data = await pool.request()
        .input('cusine_id', sql.UniqueIdentifier, cusine_id)
        .input('user_id', sql.UniqueIdentifier, user_id)
        .execute("cuisineUserCreateNew")
    return {
        "recordset": data.recordset,
        "returnValue": data.returnValue
    }
}

const findCusineUserByRecipeAndUserID = async function (cusine_id, user_id) {
    if (!validator.isUUID(cusine_id))
        throw new CustomError("cusine_id error")
    if (!validator.isUUID(user_id))
        throw new CustomError("user_id error")
    const pool = await connect;
    const data = await pool.request()
        .input('cusine_id', sql.UniqueIdentifier, cusine_id)
        .input('user_id', sql.UniqueIdentifier, user_id)
        .execute("cuisineUserFindByCusineAndUserID")
    return data.recordset
}

const cuisineUserDelete = async function (cusine_id, user_id) {
    if (!validator.isUUID(cusine_id))
        throw new CustomError("cusine_id error")
    if (!validator.isUUID(user_id))
        throw new CustomError("user_id error")
    const pool = await connect;
    const data = await pool.request()
        .input('cusine_id', sql.UniqueIdentifier, cusine_id)
        .input('user_id', sql.UniqueIdentifier, user_id)
        .execute("cuisineUserDelete")
    return data.returnValue
}
export {
    findAll, findOne, create,
    findCusineUserByRecipeAndUserID, cusineUser, cuisineUserDelete,
}
