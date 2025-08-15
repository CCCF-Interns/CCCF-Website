import pkg from "pg";
const { Pool } = pkg;

let pool;

export function connectClient() {
    if (!process.env.TEST_DATABASE_URL)
        console.log("not found");
    else    
        console.log(process.env.TESTING);
    pool = new Pool({
        connectionString: process.env.TESTING == "true" ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL,
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

export async function getDataByValueArray(query, valueArray, callback) {
    await pool.query(query, valueArray, (err, res) => {
        if (err) {
            callback(err, null);
        } else {
            callback (null, res.rows);
        }
    });
}

export async function insertData(query, valuesArray) {
    const result = await pool.query(query, valuesArray);
    return result;
}

export async function deleteDataByValue(query, value) {
    const result = await pool.query(query, value);
    return result;
}

export async function runQuery(query) {
    const result = await pool.query(query);
    return result;
}

process.on("SIGINT", async () => {
    console.log("shutting down...");
    await pool.end();
    console.log("Disconnected from database");
    process.exit(0);
});
