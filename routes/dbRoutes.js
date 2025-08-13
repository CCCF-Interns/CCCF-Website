import express from "express";
import { getData, insertData } from "../public/script/db.js";

const router = express.Router();

router.get("/api/gallery", (req, res) => {
    const query = "SELECT * FROM gallery ORDER BY created_at DESC ";
    getData(query, (err, data) => {
        if (err) return res.status(500).json({ 
            message: "Failed to get images" 
        });
        res.json({ data });
    });
});

router.post("/api/gallery/insert", async (req, res) => {
    const query = `
        INSERT INTO gallery (id, title, image_url) VALUES ($1, $2, $3);
    `;
    const itemData = req.body;
    const valuesArray = [
        itemData.id,
        itemData.title,
        itemData.image_url
    ];

    await insertData(query, valuesArray);
    res.send("Inserted");
});

export default router;