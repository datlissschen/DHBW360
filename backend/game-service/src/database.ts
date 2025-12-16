import {Pool, QueryResult} from "pg";
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
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

export async function initDatabase() {
    executeDBQuery('CREATE TABLE IF NOT EXISTS rooms(' +
            'room_id CHAR(16) PRIMARY KEY,' +
            'location_id CHAR(16),' +
            'floor_number integer' +
            ')')
}

export async function executeDBQuery(query: string, variables: any[] = []): Promise<QueryResult> {
    const client = await pool.connect()
    const result = await client.query(query, variables)
    client.release()
    return result
}