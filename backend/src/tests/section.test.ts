import { describe, it, expect } from "vitest";

import { testData, changeTestData, authRequest } from "./testSetup.js";

describe("SECTION_ROUTES", () => {
  it("POST_SECTION", async () => {
    const res = await authRequest("post", "/sections", testData.testSection);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(testData.testSection.title);
    expect(res.body.userId).toBe(testData.userId);
    changeTestData({ testSection: res.body });
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
