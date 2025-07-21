import { testData, authRequest } from "./testSetup.js";

describe("SHARED_GROUP_ROUTES", async () => {
  it("POST_SHARED_GROUP", async () => {
    const res = await authRequest("post", "/sharedGroups", {
      title: testData.testGroup.title,
      groupId: testData.testGroup.id,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(testData.testGroup.title);
  });

  it("GET_SHARED_GROUP", async () => {
    const res = await authRequest("get", "/sharedGroups");

    expect(res.statusCode).toBe(200);
    expect(res.body.sharedGroups.length).toBe(1);
  });
});
