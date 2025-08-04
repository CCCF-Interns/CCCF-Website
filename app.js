import dotenv from 'dotenv';
import createServer from './utils/server.js';

dotenv.config();

const port = process.env.PORT || 4000;
const app = createServer();


app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});