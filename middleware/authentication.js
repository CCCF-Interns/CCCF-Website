import pkg from "jsonwebtoken";
import { getDataByValueArray } from "../utils/db.js";

const jwt = pkg;

export default function authAdmin(req, res, next) {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
        if (!refreshToken) return res.redirect("/login");

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, 
        (refreshErr, refDecoded) => {
            if (refreshErr) return res.redirect("/login");

            const newAccessToken = jwt.sign(
                { email: refDecoded.email, password: refDecoded.password },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            );

            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 15 * 60 * 1000
            });

            req.user = refDecoded;
            return next();
        });
    }
    return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, 
    (err, decoded) => {
        if (!err) {
            req.user = decoded;
            return next();
        }
    });
}

export async function checkUser(email) {
    const query = `
        SELECT * FROM administrator WHERE email = $1;
    `;
    
    const values = [email];
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