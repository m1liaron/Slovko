import request from "supertest";
import { app } from "../src/index.js";

describe("USER_ROUTES", () => {
  it("should return 401 for protected route without token", async () => {
    const res = await request(app).get("/groups");
    expect(res.status).toBe(401);
    expect(res.body.message).toContain("Authentication invalid");
  });
});
