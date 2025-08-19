import { writeR2 } from "../app.js";

async function uploadFile(key, file) {
    await writeR2.putObject({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    }).promise();
}

export default uploadFile;