import express from "express";
import mult from "multer";
import { uploadFile, deleteFile, deleteBulk } from "../utils/storage.js";
import authAdmin from "../middleware/authentication.js";

const router = express.Router();
const upload = mult({ storage: mult.memoryStorage() });

router.post("/api/upload", authAdmin, upload.single("image"), 
    async (req, res) => {
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const image_url = `
        https://pub-8a92cfffcd4044fb854badc0208fe02f.r2.dev/${fileName}
    `;

    try {
        await uploadFile(fileName, req.file);
        let data = JSON.parse(req.body.data);
        let isGalleryImage = data.is_gal || false;
        let values;
        if (isGalleryImage) {
            values = {
                id: crypto.randomUUID(),
                title: req.file.originalname,
                image_url: image_url,
                album_id: data.id
            };
        }
        else {
            values = {
                id: crypto.randomUUID(),
                title: req.file.originalname,
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