import { StatusCodes } from "http-status-codes";
import { beforeAll, describe, it, expect } from "vitest";

import { testData, changeTestData, authRequest } from "./testSetup.js";

describe("GROUP_ROUTES", () => {
  beforeAll(async () => {
    const res = await authRequest("post", "/sections", testData.testSection);

    changeTestData({ testSection: res.body });
  });

  it("POST_GROUP", async () => {
    const res = await authRequest("post", "/groups", {
      title: testData.testGroup.title,
      sectionId: testData.testSection.id,
    });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(testData.testGroup.title);
    expect(res.body.sectionId).toBe(testData.testSection.id);
    changeTestData({ testGroup: res.body });
  });

  it("GET_GROUPS", async () => {
    const res = await authRequest("get", `/groups/${testData.testSection.id}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("GET_GROUP", async () => {
    const res = await authRequest(
      "get",
      `/groups/${testData.testGroup.id}/${testData.testSection.id}`,
    );

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(testData.testGroup.title);
  });

  it("PATCH_GROUP", async () => {
    const res = await authRequest("patch", `/groups/${testData.testGroup.id}`, {
      title: "Updated Group Title",
      sectionId: testData.testSection.id,
    });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Group Title");
  });

  it("DELETE_GROUP", async () => {
    const res = await authRequest(
      "delete",
      `/groups/${testData.testGroup.id}/${testData.testSection.id}`,
    );

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(testData.testGroup.id);
  });

  describe("VALIDATION", () => {
    describe("POST_GROUP", () => {
      it("rejects missing title", async () => {
        const res = await authRequest("post", "/groups", {
          sectionId: testData.testSection.id,
        });
        expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        expect(res.body.errors).toContainEqual(
          expect.objectContaining({ path: "body.title" }),
        );
      });

      it("rejects empty title", async () => {
        const res = await authRequest("post", "/groups", {
          title: "",
          sectionId: testData.testSection.id,
        });
        expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        expect(res.body.errors).toContainEqual(
          expect.objectContaining({ path: "body.title" }),
        );
      });

      it("rejects missing sectionId", async () => {
        const res = await authRequest("post", "/groups", {
          title: "Some Group",
        });
        expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        expect(res.body.errors).toContainEqual(
          expect.objectContaining({ path: "body.sectionId" }),
        );
      });

      it("rejects invalid sectionId format", async () => {
        const res = await authRequest("post", "/groups", {
          title: "Some Group",
          sectionId: "not-a-uuid",
        });
        expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        expect(res.body.errors).toContainEqual(
          expect.objectContaining({ path: "body.sectionId" }),
        );
      });
    });

    describe("GET_GROUPS", () => {
      it("rejects invalid sectionId param", async () => {
        const res = await authRequest("get", "/groups/not-a-uuid");
        expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        expect(res.body.errors).toContainEqual(
          expect.objectContaining({ path: "params.sectionId" }),
        );
      });
    });

    describe("GET_GROUP", () => {
      it("rejects invalid group id param", async () => {
        const res = await authRequest(
          "get",
          `/groups/not-a-uuid/${testData.testSection.id}`,
        );
        expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        expect(res.body.errors).toContainEqual(
          expect.objectContaining({ path: "params.id" }),
        );
      });

      it("rejects invalid sectionId param", async () => {
        const res = await authRequest(
          "get",
          `/groups/${testData.testGroup.id}/not-a-uuid`,
        );
        expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        expect(res.body.errors).toContainEqual(
          expect.objectContaining({ path: "params.sectionId" }),
        );
      });
    });

    describe("PATCH_GROUP", () => {
      it("rejects invalid group id param", async () => {
        const res = await authRequest("patch", "/groups/not-a-uuid", {
          title: "New Title",
          sectionId: testData.testSection.id,
        });
        expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        expect(res.body.errors).toContainEqual(
          expect.objectContaining({ path: "params.id" }),
        );
      });

      it("rejects missing sectionId in body", async () => {
        const res = await authRequest(
          "patch",
          `/groups/${testData.testGroup.id}`,
          { title: "New Title" },
        );
        expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        expect(res.body.errors).toContainEqual(
          expect.objectContaining({ path: "body.sectionId" }),
        );
      });

      it("rejects empty title when provided", async () => {
        const res = await authRequest(
          "patch",
          `/groups/${testData.testGroup.id}`,
          { title: "", sectionId: testData.testSection.id },
        );
        expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        expect(res.body.errors).toContainEqual(
          expect.objectContaining({ path: "body.title" }),
        );
      });
    });

    describe("DELETE_GROUP", () => {
      it("rejects invalid group id param", async () => {
        const res = await authRequest(
          "delete",
          `/groups/not-a-uuid/${testData.testSection.id}`,
        );
        expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        expect(res.body.errors).toContainEqual(
          expect.objectContaining({ path: "params.id" }),
        );
      });

      it("rejects invalid sectionId param", async () => {
        const res = await authRequest(
          "delete",
          `/groups/${testData.testGroup.id}/not-a-uuid`,
        );
        expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        expect(res.body.errors).toContainEqual(
          expect.objectContaining({ path: "params.sectionId" }),
        );
      });
    });

    describe("MOVE_GROUP", () => {
      it("rejects invalid group id param", async () => {
        const res = await authRequest("patch", "/groups/not-a-uuid/move", {
          sectionId: testData.testSection.id,
        });
        expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        expect(res.body.errors).toContainEqual(
          expect.objectContaining({ path: "params.id" }),
        );
      });

      it("rejects missing sectionId in body", async () => {
        const res = await authRequest(
          "patch",
          `/groups/${testData.testGroup.id}/move`,
          {},
        );
        expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        expect(res.body.errors).toContainEqual(
          expect.objectContaining({ path: "body.sectionId" }),
        );
      });

      it("rejects invalid sectionId format in body", async () => {
        const res = await authRequest(
          "patch",
          `/groups/${testData.testGroup.id}/move`,
          { sectionId: "not-a-uuid" },
        );
        expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        expect(res.body.errors).toContainEqual(
          expect.objectContaining({ path: "body.sectionId" }),
        );
      });
    });
  });
});
