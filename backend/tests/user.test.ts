import request from "supertest";
import { app } from "../src/index.js";
import { sequelize } from "../src/db/sequelize.js";

const testUser = {
  email: "lani@gmail.com",
  name: "lani",
  password: "rty1245"
}

let token: string;

beforeAll(async () => {
  await sequelize.sync({ force: true }); 
});

afterAll(async () => {
  await sequelize.close();
});

describe("USER_ROUTES", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/users/register").send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.token).toBeDefined();
  });

  it("should not register an existing user", async () => {
    const res = await request(app).post("/users/register").send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("already exist");
  });

  it("should login with valid credentials", async () => {
    const res = await request(app).post("/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  it("should not login with wrong password", async () => {
    const res = await request(app).post("/users/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toContain("Invalid credentials");
  });
});
