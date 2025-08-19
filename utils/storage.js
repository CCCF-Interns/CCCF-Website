import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const writeR2 = new AWS.S3({
    endpoint: `https://${process.env.R2_ID}.r2.cloudflarestorage.com`,
    accessKeyId: process.env.R2_WRITE_KEY,
    secretAccessKey: process.env.R2_WRITE_SECRET,
    signatureVersion: "v4",
    region: "auto",
});

const readR2 = new AWS.S3({
    endpoint: `https://${process.env.R2_ID}.r2.cloudflarestorage.com`,
    accessKeyId: process.env.R2_READ_KEY,
    secretAccessKey: process.env.R2_READ_SECRET,
    signatureVersion: "v4",
    region: "auto",
});

async function uploadFile(key, file) {
    await writeR2.putObject({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    }).promise();
}

export default uploadFile;