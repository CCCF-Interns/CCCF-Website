const express = require("express");
const path = require("path");
const app = express();
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
require('dotenv').config();
const port = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(session({
        cookie: { maxAge: 86400000 },
        store: new MemoryStore({
            checkPeriod: 86400000
        }),
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET
    })
);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/header.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'header.html'));
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});