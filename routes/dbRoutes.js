import express from "express";
import { deleteDataByValue, getData, insertData } from "../utils/db.js";
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

router.post("/api/member/insert", authAdmin, async (req, res) => {
    const query = `
        INSERT INTO team_member (id, name, job_title, job_level, description, 
        image_url) VALUES ($1, $2, $3, $4, $5, $6);
    `;
    const itemData = req.body;

    const valuesArray = [
        itemData.data.id,
        itemData.data.name,
        itemData.data.job,
        itemData.data.level,
        itemData.data.description,
        itemData.data.image_url
    ];

    await insertData(query, valuesArray);

    res.json("Inserted");
});

router.post("/api/member/socials/insert", authAdmin, async (req, res) => {
    const query = `
        INSERT INTO team_member_socials (id, social_url, social_type) VALUES (
        $1, $2, $3);
    `;
    const itemData = req.body;

    for (let i = 0; i < itemData.data.socials.length; i++) {
        const valuesArray = [
            itemData.data.id,
            itemData.data.socials[i], 
            itemData.data.social_types[i]
        ];

        await insertData(query, valuesArray);
    }
    
    res.json("Inserted");
});

router.get("/api/member", async (req, res) => {
    const query = "SELECT * FROM team_member ORDER BY job_level DESC, name ASC";
    getData(query, (err, data) => {
        if (err) return res.status(500).json({ 
            message: "Failed to get team members" 
        });
        res.json({ data });
    });
});

router.get("/api/member/socials", async (req, res) => {
    const query = "SELECT * FROM team_member_socials";
    getData(query, (err, data) => {
        if (err) return res.status(500).json({ 
            message: "Failed to get team members social" 
        });
        res.json({ data });
    });
});

router.post("/api/member/socials/delete", async (req, res) => {
    const query = "DELETE FROM team_member_socials WHERE id = $1";
    try {
        await deleteDataByValue(query, [req.body.id]);
        res.json({ message: "socials deleted" });
    }
    catch (error) {
        res.json({ message: "Could not delete socials" });
    }
});

router.post("/api/member/delete", async (req, res) => {
    const query = "DELETE FROM team_member WHERE id = $1";
    try {
        await deleteDataByValue(query, [req.body.id]);
        res.json({ message: "member deleted" });
    }
    catch (error) {
        res.json({ message: "Could not delete member" });
    }
});

export default router;