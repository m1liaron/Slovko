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
  it("USER_REGISTER should register a new user", async () => {
    const res = await request(app).post("/users/register").send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.token).toBeDefined();
  });

  it("USER_REGISTER should not register an existing user", async () => {
    const res = await request(app).post("/users/register").send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("already exist");
  });

  it("USER_LOGIN should login with valid credentials", async () => {
    const res = await request(app).post("/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  it("USER_LOGIN should not login with wrong password", async () => {
    const res = await request(app).post("/users/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toContain("Invalid credentials");
  });

  it("GET_USER should return user by token", async () => {
    const res = await request(app).get("/users").set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(testUser.email)
  });
});
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNWM3ZDQyOC1iNTg3LTQ1MzYtOWNhOS01ZTg5ZjJlYTM3MGIiLCJuYW1lIjoiYmliYSIsImlhdCI6MTc1MjY5MDQzMywiZXhwIjoxNzU1MjgyNDMzfQ.87Cr5Lt - yRWh1KV38A41urIFge7nBNDHXZ5XlVO6ViY