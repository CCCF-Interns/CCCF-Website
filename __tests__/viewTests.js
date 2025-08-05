import request from "supertest";
import createServer from "../utils/server.js";

const app = createServer();

describe("Test the root path", () => {
    test("It should respond to the GET method", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
    });
});