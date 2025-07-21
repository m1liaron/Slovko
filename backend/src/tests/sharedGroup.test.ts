import { testData, authRequest } from "./testSetup.js";

let sharedGroupId = "";

describe("SHARED_GROUP_ROUTES", async () => {
  it("POST_SHARED_GROUP", async () => {
    const res = await authRequest("post", "/sharedGroups", {
      title: testData.testGroup.title,
      groupId: testData.testGroup.id,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(testData.testGroup.title);
    sharedGroupId = res.body.id;
  });

  it("GET_SHARED_GROUPS", async () => {
    const res = await authRequest("get", "/sharedGroups");

    expect(res.statusCode).toBe(200);
    expect(res.body.sharedGroups.length).toBe(1);
  });

  it("GET_SHARED_GROUP by id", async () => {
    const res = await authRequest("get", `/sharedGroups/${sharedGroupId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(sharedGroupId);
  });

  it("DELETE_SHARED_GROUP by id", async () => {
    const res = await authRequest("delete", `/sharedGroups/${sharedGroupId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(sharedGroupId);
  });
});
