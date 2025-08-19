import cron from "node-cron";
import { runQuery } from "./db.js";

cron.schedule("0 0 * * *", async () => {
    const query = "DELETE FROM token WHERE expires_at < NOW();";
    await runQuery(query);
});