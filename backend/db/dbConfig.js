const config = {
    connectionString: `DRIVER={ODBC Driver 17 for SQL Server};SERVER=${process.env.db_sever};DATABASE=${process.env.db_database};UID=${process.env.db_username};PWD=${process.env.db_password}`
}

export default config