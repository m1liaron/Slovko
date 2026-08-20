import request from "supertest";
import { beforeAll, describe, it, expect } from "vitest";

import { app } from "../index.js";

import { setup } from "./setup.js";
import { testData, changeTestData, authRequest } from "./testSetup.js";

console.log("DATABASE_URL seen by test:", process.env.DATABASE_URL);

beforeAll(async () => {
  setup();
});

describe("AUTH_ROUTES", () => {
  it("USER_REGISTER should register a new user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send(testData.testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.token).toBeDefined();
  });

  it("USER_REGISTER should not register an existing user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send(testData.testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("already exist");
  });

  it("USER_LOGIN should login with valid credentials", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testData.testUser.email,
      password: testData.testUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.token).toBeDefined();

    changeTestData({ token: res.body.token });
    changeTestData({ userId: res.body.user.id });
  });

  it("USER_LOGIN should not login with wrong password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testData.testUser.email,
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toContain("Invalid credentials");
  });
});
