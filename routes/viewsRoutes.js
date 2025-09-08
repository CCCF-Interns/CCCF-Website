import express from "express";
import path from "path";
import __dirname from "../dirname.js";
import adminAuth from "../middleware/authentication.js";

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

router.get("/donate", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "donate.html"));
});

router.get("/gallery", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "gallery.html"));
});

router.get("/blogs", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "blogs.html"));
});

router.get("/blogs/:id", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "blog.html"));
});

router.get("/admin", adminAuth, (req, res) => {
    console.log("Working");
    res.sendFile(path.join(__dirname, "views", "admin.html"));
});

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

router.get("/redirect/:name", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "redirect.html"));
});

export default router;