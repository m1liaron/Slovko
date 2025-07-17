import request from "supertest";
import { app } from "../index.js";
import { sequelize } from "../db/sequelize.js";
import { testData, changeTestData } from "./testSetup.js";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("USER_ROUTES", () => {
  it("USER_REGISTER should register a new user", async () => {
    const res = await request(app)
      .post("/users/register")
      .send(testData.testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.token).toBeDefined();
  });

  it("USER_REGISTER should not register an existing user", async () => {
    const res = await request(app)
      .post("/users/register")
      .send(testData.testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("already exist");
  });

  it("USER_LOGIN should login with valid credentials", async () => {
    const res = await request(app).post("/users/login").send({
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
    const res = await request(app).post("/users/login").send({
      email: testData.testUser.email,
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toContain("Invalid credentials");
  });

  it("GET_USER should return user by token", async () => {
    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${testData.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(testData.testUser.email);
  });

  it("PUT_USER should update user data", async () => {
    const res = await request(app)
      .patch(`/users/${testData.userId}`)
      .set("Authorization", `Bearer ${testData.token}`)
      .send({ email: "updatedEmail@gmail.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("updatedEmail@gmail.com");
    expect(res.body.name).toBe(testData.testUser.name);
  });

  it("UPDATE_USER_STREAK should update user's streak", async () => {
    const res = await request(app)
      .post("/users/streak")
      .set("Authorization", `Bearer ${testData.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", testData.userId);
    expect(res.body).toHaveProperty("streak");
  });

  it("GET_STREAK_DATES should return streak dates", async () => {
    const now = new Date();
    const res = await request(app)
      .get(
        `/users/streak?month=${now.getMonth() + 1}&year=${now.getFullYear()}`,
      )
      .set("Authorization", `Bearer ${testData.token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("date");
  });

  it("POST_USER_FREEZE should buy freeze", async () => {
    const res = await request(app)
      .put("/users/streak/froze")
      .set("Authorization", `Bearer ${testData.token}`)
      .send({ froze: 50 });

    expect(res.statusCode).toBe(200);
    expect(res.body.frozen).toBe(true);
  });

  it("POST_USER_FREEZE should already have freeze", async () => {
    const res = await request(app)
      .put("/users/streak/froze")
      .set("Authorization", `Bearer ${testData.token}`)
      .send({ froze: 100 });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("You already have freeze");
  });
});
