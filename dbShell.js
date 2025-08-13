// Run to interact with database in console

const repl = await import("repl");
const pg = await import("pg");
const dotenv = await import("dotenv");
dotenv.config();

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

const dbShell = async () => {
    try {
        await client.connect();
        console.log("Connected to PostgreSQL.");

        const server = repl.start({
            prompt: "pg> ",
            useColors: true,
            ignoreUndefined: true,
        });

        // Make 'db' available inside the REPL
        server.context.db = {
            query: async (sql, params = []) => {
                try {
                    const res = await client.query(sql, params);
                    return res.rows;
                } catch (err) {
                    console.error("Query error:", err.message);
                }
            },
            end: async () => {
                await client.end();
                console.log("Connection closed.");
                process.exit(0);
            }
        };

        console.log(`
Welcome to PostgreSQL REPL.
Example Uses:
    await db.query('SELECT * FROM administrator')
    await db.query('SELECT * FROM administrator WHERE email=$1', ["something@example.com"])

Use
    'await db.end()' to exit
        `);
    } catch (err) {
        console.error("Failed to connect:", err.message);
        process.exit(1);
    }
};

dbShell();