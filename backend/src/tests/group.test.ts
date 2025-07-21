import { testData, changeTestData, authRequest } from "./testSetup.js";

describe("GROUP_ROUTES", () => {
  it("POST_GROUP", async () => {
    const res = await authRequest("post", "/groups", testData.testGroup);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(testData.testGroup.title);
    expect(res.body.userId).toBe(testData.userId);
    changeTestData({ testGroup: res.body });
  });

  it("GET_GROUPS", async () => {
    const res = await authRequest("get", "/groups");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("GET_GROUP", async () => {
    const res = await authRequest("get", `/groups/${testData.testGroup.id}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(testData.testGroup.title);
  });

  it("PATCH_GROUP", async () => {
    const res = await authRequest("patch", `/groups/${testData.testGroup.id}`, {
      title: "Updated Group Title",
    });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Group Title");
  });

  it("DELETE_GROUP", async () => {
    const res = await authRequest("delete", `/groups/${testData.testGroup.id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(testData.testGroup.id);
  });
});
