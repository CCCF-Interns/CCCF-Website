import dotenv from "dotenv";
import pkg from "pg";
const { Client } = pkg;

let client;

export function connectClient() {
    client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    client.connect();
}

export function getData(query, callback) {
    client.query(query, (err, res) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, res.rows);
        }
    });       
}

export async function insertData(query, valuesArray) {
    const result = await client.query(query, valuesArray);
    return result;
}

process.on('SIGINT', async () => {
    console.log("shutting down...");
    await client.end();
    console.log("Disconnected from database");
    process.exit(0);
});
