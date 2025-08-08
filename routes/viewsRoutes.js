import express from "express";
import path from "path";
import __dirname from "../dirname.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

router.get("/header.html", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "header.html"));
});
router.get("/footer.html", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "footer.html"));
});
router.get("/about-us", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

export default router;