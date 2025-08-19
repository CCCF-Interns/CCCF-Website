import express from "express";
import { getData, insertData } from "../utils/db.js";
import authAdmin from "../middleware/authentication.js";

const router = express.Router();

router.post("/api/gallery", (req, res) => {
    const offset = 30 * (req.body.page - 1);
    const query = `
        SELECT * FROM gallery ORDER BY created_at DESC LIMIT 30 OFFSET ${offset}
    `;
    getData(query, (err, data) => {
        if (err) return res.status(500).json({ 
            message: "Failed to get images" 
        });
        res.json({ data });
    });
});

router.get("/api/gallery/total", async (req, res) => {
    const query = "SELECT count(*) as total from gallery";
    getData(query, (err, data) => {
        if (err) return res.status(500).json({ 
            message: "Failed to get total" 
        });
        res.json({ data });
    });
});

router.post("/api/gallery/insert", authAdmin, async (req, res) => {
    const query = `
        INSERT INTO gallery (id, title, image_url) VALUES ($1, $2, $3);
    `;
    const itemData = req.body;

    const valuesArray = [
        itemData.data.id,
        itemData.data.title,
        itemData.data.image_url
    ];

    await insertData(query, valuesArray);
    res.json("Inserted");
});

export default router;