import request from "supertest";
import createServer from "../utils/server";
import { connectClient } from "../utils/db";
import jwt from "jsonwebtoken";

const app = createServer();
connectClient();

describe("Testing authentication", () => {
    describe("Login functionality should work", () => {
        test("User should be able to login with correct credentials", async () => {
            const response = await request(app).post("/api/login").send({
                email: "something@example.com",
                password: "something"
            });
            expect(response.status).toBe(200);
            expect(response.body["message"]).toBe("Logged in");
        });
        test("User should not be able to login with incorrect credentials", async () => {
            const response = await request(app).post("/api/login").send({
                email: "something@example.com",
                password: "something1"
            });
            expect(response.status).toBe(401);
            expect(response.body["message"]).toBe("Wrong email or password");
        });
        test("Missing Credentials should be handled", async () => {
            const response = await request(app).post("/api/login").send({
                email: "something@example.com"
            });
            expect(response.status).toBe(400);
            expect(response.body["message"]).toBe("Please provide the appropriate fields");
        });
    });
});

describe("Testing authorization", () => {
    describe("Only admins should have access to CMS", () => {
        test("Users without refresh token and access token should not be able to access /admin route and should be redirected to /login", async () => {
            const response = await request(app).get("/admin");
            expect(response.status).toBe(302);
            expect(response.header.location).toBe("/login");
        }); 
        test("Users with refresh token and access token should be able to access /admin route", async () => {
            const user = {
                email: "something@example.com",
                password: "something"
            };
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { 
                expiresIn: "15m" 
            });
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET); 
            const response = await request(app).
                                get("/admin").
                                set("Cookie", [`accessToken=${accessToken};refreshToken=${refreshToken}`]);
            expect(response.status).toBe(200);
        }); 
    });
});