import {Pool, QueryResult} from "pg";

let pool: Pool | undefined = undefined

export async function initDatabase() {
    console.log(`Initializing database host=${process.env.DB_HOST}`);
    pool = new Pool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    })
    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })
    await executeDBQuery('CREATE TABLE IF NOT EXISTS scores(' +
            'username CHAR(32) PRIMARY KEY,' +
            'score CHAR(16)' +
            ')')
}

export async function executeDBQuery(query: string, variables: any[] = []): Promise<QueryResult> {
    const client = await pool!.connect()
    const result = await client.query(query, variables)
    client.release()
    return result
}