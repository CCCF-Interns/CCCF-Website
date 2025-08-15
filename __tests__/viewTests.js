import request from "supertest";
import createServer from "../utils/server.js";

const app = createServer();

describe ("Testing the views", () => {
    describe("Test the header path", () => {
        test("It should respond to the GET method", async () => {
            const response = await request(app).get("/header.html");
            expect(response.statusCode).toBe(200);
        });
    });
    describe("Test the footer path", () => {
        test("It should respond to the GET method", async () => {
            const response = await request(app).get("/footer.html");
            expect(response.statusCode).toBe(200);
        });
    });
    describe("Test the root path", () => {
        test("It should respond to the GET method", async () => {
            const response = await request(app).get("/");
            expect(response.statusCode).toBe(200);
        });
    });
    describe("Test the about-us path", () => {
        test("It should respond to the GET method", async () => {
            const response = await request(app).get("/about-us");
            expect(response.statusCode).toBe(200);
        });
    });
    describe("Test the gallery path", () => {
        test("It should respond to the GET method", async () => {
            const response = await request(app).get("/gallery");
            expect(response.statusCode).toBe(200);
        });
    });
    describe("Test the login path", () => {
        test("It should respond to the GET method", async () => {
            const response = await request(app).get("/login");
            expect(response.statusCode).toBe(200);
        });
    });
    describe("Test the donate path", () => {
        test("It should respond to the GET method", async () => {
            const response = await request(app).get("/donate");
            expect(response.statusCode).toBe(200);
        });
    });
});

