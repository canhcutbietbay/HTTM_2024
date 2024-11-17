import { sql, connect } from './index.js'
import validator from 'validator';
import { CustomError } from '../utils/error.js';

const findAll = async function () {
    const pool = await connect;
    const data = await pool.request().query("select * from ingredients")
    return (data.recordset)
}

const findOne = async function (id) {
    if (validator.isUUID(id)) {
        const pool = await connect;
        const data = await pool.request().input('id', sql.UniqueIdentifier, id).execute("ingredientsFindByID")
        return (data.recordset)
    }
    else {
        throw new CustomError("ID not valid", 400)
    }

}

const create = async function (params) {

}

export {
    findAll, findOne, create
}
