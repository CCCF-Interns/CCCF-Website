import dotenv from "dotenv";
dotenv.config();
import createServer from "./utils/server.js";
import { connectClient } from "./utils/db.js";
import AWS from "aws-sdk";
import "./utils/schedules.js";

const app = createServer();
const port = process.env.PORT || 4000;

export const writeR2 = new AWS.S3({
    endpoint: `https://${process.env.R2_ID}.r2.cloudflarestorage.com`,
    accessKeyId: process.env.R2_WRITE_KEY,
    secretAccessKey: process.env.R2_WRITE_SECRET,
    signatureVersion: 'v4',
    region: 'auto',
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
    connectClient();
});