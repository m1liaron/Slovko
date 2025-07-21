import { testData, authRequest } from "./testSetup.js";

let sharedGroupId = "";
let sharedGroupTitle = "";

describe("SHARED_GROUP_ROUTES", async () => {
  it("POST_SHARED_GROUP", async () => {
    const res = await authRequest("post", "/sharedGroups", {
      title: "New shared group",
      groupId: testData.testGroup.id,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("New shared group");
    sharedGroupId = res.body.id;
    sharedGroupTitle = res.body.title;
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

  it("COPY_SHARED_GROUP", async () => {
    const res = await authRequest("post", `/sharedGroups/${sharedGroupId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(sharedGroupTitle);
  });

  it("DELETE_SHARED_GROUP by id", async () => {
    const res = await authRequest("delete", `/sharedGroups/${sharedGroupId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(sharedGroupId);
  });
});
