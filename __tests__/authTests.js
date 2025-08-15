import request from "supertest";
import createServer from "../utils/server";
import { newDb } from "pg-mem";

beforeAll(() => {
    const db = newDb();
// db.public.many(/* put some sql here */);

});
