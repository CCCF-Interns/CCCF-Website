import express from "express";
import pkg from "jsonwebtoken";
import { checkUser, checkRefreshToken } from "../middleware/authentication.js";
import { deleteDataByValue, insertData } from "../utils/db.js";
import bcrypt from "bcrypt"

const router = express.Router();
const jwt = pkg;

router.get("/api/token", async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken == null) return res.status(401).json({ 
        message: "You need to log in first"
    });

    const data = await checkRefreshToken(refreshToken);

    if (data[0]["islogged"] === 1) {
        const accessToken = jwt.sign(
            refreshToken, 
            process.env.ACCESS_TOKEN_SECRET
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 1000
        });
    }

    res.json({ message: "Logged in" });
});

router.get("/api/logout", async (req, res) => {
    const query = `DELETE FROM token WHERE refresh_token = $1`;
    const value = [req.cookies.refreshToken];

    try {
        await deleteDataByValue(query, value);

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        res.status(201).json({ message: "logged out" });
    }
    catch (err) {
        res.status(500).json({ message: `Could not logout: ${err}` });
    }
});

router.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const user = {
        email: email,
        password: password
    };

    try {
        const data = await checkUser(email);
        const islogged = await bcrypt.compare(password, data[0].password)
        if (!islogged) return res.status(401).json( {
            message: "Wrong email or password" 
        });

        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { 
            expiresIn: "15s" 
        });

        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 1000
        });
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const query = `INSERT INTO token VALUES ($1, CURRENT_TIMESTAMP + 
        INTERVAL '7 days')`;

        const values = [refreshToken];

        await insertData(query, values);

        res.json({ message: "Logged in" });
    }
    catch(err) {
        res.status(401).json({
            message: "Wrong email or password"
        }) 
    }
});

export default router;