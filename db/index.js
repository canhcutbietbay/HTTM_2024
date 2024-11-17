import dbConfig from './dbConfig.js'
import sql from 'mssql/msnodesqlv8.js'
const connect = new sql.ConnectionPool(dbConfig).connect()
    .then((pool) => {
        return pool;
    })
    .catch(err => {
        console.error('SQL error:', err.message);
    });

export {
    connect, sql
}