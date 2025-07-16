import request from "supertest";
import { app } from "../src/index.js";

const NEW_USER_DATA = {
  email: "lani@gmail.com",
  name: "lani",
  password: "rty1245"
}

describe("USER_ROUTES", () => {
  it("REGISTER", async () => {
    const res = await request(app).post("/users/register").send(NEW_USER_DATA);

    expect(res.status).toBeGreaterThanOrEqual(200);
  });
});
