import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import memorystore from 'memorystore';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const MemoryStore = memorystore(session);
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

app.get('/AboutUs', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});