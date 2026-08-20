import { describe, it, expect } from "vitest";

import { testData, authRequest } from "./testSetup.js";

describe("USER_ROUTES", () => {
  it("GET_USER should return user by token", async () => {
    const res = await authRequest("get", "/users/me");

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(testData.testUser.email);
  });

  it("PATCH_USER should update user data", async () => {
    const res = await authRequest("patch", `/users/${testData.userId}`, {
      email: "updatedEmail@gmail.com",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("updatedEmail@gmail.com");
    expect(res.body.name).toBe(testData.testUser.name);
  });

  it("UPDATE_USER_STREAK should update user's streak", async () => {
    const res = await authRequest("post", "/users/streak");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", testData.userId);
    expect(res.body).toHaveProperty("streak");
  });

  it("GET_STREAK_DATES should return streak dates", async () => {
    const now = new Date();
    const res = await authRequest(
      "get",
      `/users/streak?month=${now.getMonth() + 1}&year=${now.getFullYear()}`,
    );

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("date");
  });

  it("POST_USER_FREEZE should buy freeze", async () => {
    const res = await authRequest("put", "/users/streak/froze", { froze: 50 });

    expect(res.statusCode).toBe(200);
    expect(res.body.frozen).toBe(true);
  });

  it("POST_USER_FREEZE should already have freeze", async () => {
    const res = await authRequest("put", "/users/streak/froze", { froze: 50 });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("You already have freeze");
  });
});
