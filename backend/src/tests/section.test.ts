import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";

import { app } from "../index.js";

import { testData, changeTestData, authRequest } from "./testSetup.js";

beforeAll(async () => {
  const newUserRes = await request(app)
    .post("/users/register")
    .send(testData.testUser2);

  changeTestData({ testUser2: newUserRes.body });
});

describe("SECTION_ROUTES", () => {
  it("POST_SECTION", async () => {
    const res = await authRequest("post", "/sections", testData.testSection);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(testData.testSection.title);
    expect(res.body.userId).toBe(testData.userId);
    changeTestData({ testSection: res.body });
  });

  it("DELETE_SECTION should deny access when user is not owner", async () => {
    const res = await request(app)
      .delete(`/sections/${testData.testSection.id}`)
      .set("Authorization", `Bearer ${testData.testUser2.token}`);

    expect(res.status).toBe(StatusCodes.FORBIDDEN);
  });

  it("GET_SECTIONS", async () => {
    const res = await authRequest("get", "/sections");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("PATCH_SECTION", async () => {
    const newTitle = "Updated Section Title";
    const res = await authRequest(
      "patch",
      `/sections/${testData.testSection.id}`,
      {
        title: newTitle,
      },
    );

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(newTitle);
  });

  it("DELETE_SECTION", async () => {
    const res = await authRequest(
      "delete",
      `/sections/${testData.testSection.id}`,
    );

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(testData.testSection.id);
  });
});
