import request from "supertest";
import createServer from "../utils/server";
import { connectClient } from "../utils/db";

const app = createServer();
connectClient();

describe("Testing authentication", () => {
    describe("Login functionality should work", () => {
        test("User should be able to login with correct credentials", async () => {
            const response = await request(app).post("/api/login").send({
                email: "something@example.com",
                password: "something"
            })
            expect(response.status).toBe(200);
            expect(response.body["message"]).toBe("Logged in")
        });
        test("User should not be able to login with incorrect credentials", async () => {
            const response = await request(app).post("/api/login").send({
                email: "something@example.com",
                password: "something1"
            })
            expect(response.status).toBe(401);
            expect(response.body["message"]).toBe("Wrong email or password")
        })
        test("Missing Credentials should be handled", async () => {
            const response = await request(app).post("/api/login").send({
                email: "something@example.com"
            })
            expect(response.status).toBe(400);
            expect(response.body["message"]).toBe("Please provide the appropriate fields")
        })
    });
});

describe("Testing authorization", () => {
    describe("Only admins should have access to CMS", () => {
        // To be implemented
    });
});