import AWS from "aws-sdk";
import dotenv from "dotenv";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

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

export async function uploadFile(key, file) {
  const body =
    file instanceof Buffer
      ? file
      : file.buffer || Buffer.from(file); // fallback just in case

  const contentType =
    file.mimetype || "application/octet-stream"; // default if not multer file

  await writeR2
    .putObject({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
    .promise();
}

export async function deleteFile(key) {
  try {
    await writeR2.deleteObject({
        Bucket: process.env.R2_BUCKET,
        Key: key
    }).promise();

    console.log(`Deleted: ${key}`);
  } catch (err) {
    console.error("Error deleting file:", err);
  }
}

export async function deleteBulk(keys) {
  return writeR2.deleteObjects({
    Bucket: process.env.R2_BUCKET,
    Delete: {
      Objects: keys.map((key) => ({ Key: key })),
      Quiet: false,
    },
  })
  .promise();
}