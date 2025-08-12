import pkg from 'jsonwebtoken';
import { getData, getDataByValueArray } from '../public/script/db.js';

const jwt = pkg;

export default function authAdmin(req, res, next) {
    const token = req.cookies.accessToken;
    if (!token) return res.redirect("/login");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).send("Invalid Token");
        req.user = decoded;
        next();
    });
}

export async function checkUser(email, password) {
    const query = `
        SELECT 1 as isLogged FROM administrator WHERE email=$1 AND password=$2;
    `;
    
    const values = [email, password];
    return new Promise((resolve, reject) => {
        getDataByValueArray(query, values, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

export async function checkRefreshToken(refreshToken) {
    const query = `
        SELECT 1 as isLogged FROM token WHERE refresh_token = $1;
    `;

    const values = [refreshToken];
    return new Promise((resolve, reject) => {
        getDataByValueArray(query, values, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}