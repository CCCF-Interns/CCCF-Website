import express from "express";
import mult from "multer";
import { uploadFile, deleteFile, deleteBulk } from "../utils/storage.js";
import { resizeImage, convertToJPG, convertToWEBP } from "../utils/imageProcessing.js";
import authAdmin from "../middleware/authentication.js";

const router = express.Router();
const upload = mult({ storage: mult.memoryStorage() });

router.post("/api/upload", authAdmin, upload.single("image"), 
    async (req, res) => {
    let originalName = req.file.originalname;
    let fileName = `${Date.now()}-${req.file.originalname}`;
    let file = req.file;
    let buffer = file.buffer;
    let ext = (fileName.split(".")[fileName.split(".").length - 1]);

    if (ext == "HEIC" || ext == "heic")
        buffer = await convertToJPG(buffer);

    if (ext != "webp" || ext != "WEBP")
        buffer = await convertToWEBP(buffer);

    
    file = { ...file, buffer: buffer };
    originalName = originalName.split(".").slice(0, -1).join("") + ".webp";
    fileName = `${Date.now()}-${originalName}`;

    const image_url = `
        https://pub-8a92cfffcd4044fb854badc0208fe02f.r2.dev/${fileName}
    `;

    let thumbName = fileName.split(".").slice(0, -1).join("");
    thumbName = `thumbnails/${thumbName}.webp`;
    const thumbnail_url = `
        https://pub-8a92cfffcd4044fb854badc0208fe02f.r2.dev/${thumbName}
    `;

    try {
        await uploadFile(fileName, buffer);

        let data = JSON.parse(req.body.data);
        let isGalleryImage = data.is_gal || false;
        let values;
        if (isGalleryImage) {
            let resizedImage = await resizeImage(buffer);

            await uploadFile(thumbName, resizedImage);

            values = {
                id: crypto.randomUUID(),
                title: originalName,
                image_url: image_url,
                thumbnail_url: thumbnail_url,
                album_id: data.id
            };
        }
        else {
            values = {
                id: crypto.randomUUID(),
                title: originalName,
                image_url: image_url
            };
        }

        res.json({ values });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Failed to upload file to R2");
    }
});

router.post("/api/delete", authAdmin, async (req, res) => {
    try {
        await deleteFile(req.body.key);
        res.json({ message: "Deleted" });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Failed to delete file from R2");
    }
});

router.post("/api/delete/bulk", authAdmin, async (req, res) => {
    try {
        await deleteBulk(req.body.keys);
        res.json({ message: "Deleted" });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Failed to delete files from R2");
    }
});

export default router;