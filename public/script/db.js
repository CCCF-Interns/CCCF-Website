import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

let pool;

export function connectClient() {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });
}

export async function getData(query, callback) {
    await pool.query(query, (err, res) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, res.rows);
        }
    });       
}

export async function insertData(query, valuesArray) {
    const result = await pool.query(query, valuesArray);
    return result;
}

process.on('SIGINT', async () => {
    console.log("shutting down...");
    await pool.end();
    console.log("Disconnected from database");
    process.exit(0);
});
