import dotenv from "dotenv";
dotenv.config();
import createServer from "./utils/server.js";
import { connectClient } from "./utils/db.js";
import "./utils/schedules.js";

const app = createServer();
const port = process.env.PORT || 4000;



app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
    connectClient();
});