import path from "path";
import express from "express";
import memorystore from "memorystore";
import session from "express-session";
import viewsRoutes from "../routes/viewsRoutes.js";
import dbRoutes from "../routes/dbRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import __dirname from "../dirname.js";
import cookieParser from "cookie-parser";

function createServer () {
    const app = express();
    const MemoryStore = memorystore(session);

    app.use(express.static(path.join(__dirname, "public")));
    app.use(express.json());
    app.use(session({
            cookie: { maxAge: 86400000 },
            store: new MemoryStore({
                checkPeriod: 86400000
            }),
            resave: false,
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET || "The Secret"
        })
    );
    app.use(cookieParser());

    app.use(viewsRoutes);
    app.use(dbRoutes);
    app.use(adminRoutes);

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send("Something broke!");
    });

    return app;
};

export default createServer;
