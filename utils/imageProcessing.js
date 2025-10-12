import sharp from "sharp";

export async function resizeImage(file) {
    try {
        const resizedBuffer = await sharp(file)
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