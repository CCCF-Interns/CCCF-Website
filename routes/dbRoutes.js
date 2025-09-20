import express from "express";
import { deleteDataByValue, getData, getDataByValueArray, insertData } from "../utils/db.js";
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

router.post("/api/gallery/album", (req, res) => {
    let query;
    let values;
    let isLimited = req.body.is_lim || false;
    let offset = 30 * (req.body.page - 1);

    if (!isLimited) {
        query = `
            SELECT * FROM gallery WHERE album_id = $1
        `;
    }
    else {
        query = `
            SELECT * FROM gallery WHERE album_id = $1 LIMIT 30 OFFSET ${offset}
        `;
    }

    values = [req.body.id];

    getDataByValueArray(query, values, (err, data) => {
        if (err) return res.status(500).json({ 
            message: "Failed to get images" 
        });
        res.json({ data });
    });
});

router.post("/api/gallery/album/total", async (req, res) => {
    const query = `
        SELECT count(*) as total 
        FROM gallery
        WHERE album_id = $1
        GROUP BY album_id 
    `;

    const values = [req.body.id];

    getDataByValueArray(query, values, (err, data) => {
        if (err) return res.status(500).json({ 
            message: "Failed to get total" 
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
        INSERT INTO gallery (id, title, image_url, album_id) VALUES ($1, $2, $3,
            $4);
    `;
    const itemData = req.body;

    const valuesArray = [
        itemData.data.id,
        itemData.data.title,
        itemData.data.image_url,
        itemData.data.album_id
    ];

    await insertData(query, valuesArray);
    res.json("Inserted");
});

router.post("/api/gallery/delete", authAdmin, async (req, res) => {
    const query = `
        DELETE FROM gallery WHERE id = $1;
    `;
    const value = [req.body.id];

    await deleteDataByValue(query, value);
    res.json("Deleted");
});

router.post("/api/gallery/delete/album", authAdmin, async (req, res) => {
    const query = `
        DELETE FROM gallery WHERE album_id = $1;
    `;
    const value = [req.body.id];

    await deleteDataByValue(query, value);
    res.json("Deleted");
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

router.post("/api/album/insert", authAdmin, async (req, res) => {
    const query = `INSERT INTO album (ID, Name, created_at) VALUES ($1, $2,
        CURRENT_TIMESTAMP)`;

    try {
        const itemData = req.body;

        const values = [
            itemData.data.id,
            itemData.data.name
        ];

        await insertData(query, values);

        res.json("Inserted");
    }
    catch(error) {
        req.status(500).json({ message: "Couldn't insert" });
    }
});

router.get("/api/album", async (req, res) => {
    const query = "SELECT * FROM album";
    getData(query, (err, data) => {
        if (err) return res.status(500).json({ 
            message: "Failed to get albums" 
        });
        res.json({ data });
    });
});

router.get("/api/album/existing", async (req, res) => {
    const query = `
        SELECT a.*, res.total, cover.image_url
        FROM album a,
        (
            SELECT album_id, COUNT(*) AS total 
            FROM gallery 
            GROUP BY album_id
        ) AS res,
        (
            SELECT DISTINCT ON (album_id) album_id, image_url
            FROM gallery
            ORDER BY album_id, created_at DESC
        ) AS cover
        WHERE a.id = res.album_id
        AND a.id = cover.album_id
        ORDER BY created_at DESC
    `;
    getData(query, (err, data) => {
        if (err) return res.status(500).json({ 
            message: "Failed to get albums" 
        });
        res.json({ data });
    });
});

router.post("/api/album/id", async (req, res) => {
    const query = `
        SELECT a.*, res.total, cover.image_url
        FROM album a,
        (
            SELECT album_id, COUNT(*) AS total 
            FROM gallery 
            GROUP BY album_id
        ) AS res,
        (
            SELECT DISTINCT ON (album_id) album_id, image_url
            FROM gallery
            ORDER BY album_id, created_at DESC
        ) AS cover
        WHERE a.id = res.album_id
        AND a.id = cover.album_id
        AND a.id = $1    
    `;
    let values = [req.body.id];
    getDataByValueArray(query, values, (err, data) => {
        if (err) return res.status(500).json({ 
            message: "Failed to get album" 
        });
        res.json({ data });
    });
});

router.post("/api/album/delete", authAdmin, async (req, res) => {
    const query = `
        DELETE FROM album WHERE id = $1;
    `;
    const value = [req.body.id];
    console.log(value);
    await deleteDataByValue(query, value);
    res.json("Deleted");
});

export default router;