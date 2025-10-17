import heicConvert from "heic-convert";
import sharp from "sharp";

export async function resizeImage(file) {
    try {
        const resizedBuffer = await sharp(file)
        .rotate()
        .resize(512, 512, { fit: "inside" })
        .toFormat("webp", { quality: 80 })
        .toBuffer();

        return resizedBuffer;
    }
    catch (error) {
        console.error("Could not resize image: ", error);
        return null;
    }
}

export async function convertToJPG(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error("convertToJPG expected a Buffer, got " + typeof buffer);
  }

  const outputBuffer = await heicConvert({
    buffer,
    format: "JPEG",
    quality: 1
  });

  return outputBuffer;
}

export async function convertToWEBP(buffer) {
    try {
        const newBuffer = await sharp(buffer)
        .rotate()
        .toFormat("webp", { quality: 100 })
        .toBuffer();

        return newBuffer;
    }
    catch (error) {
        console.error("Could not convert to webp: ", error);
        return null;
    }
}