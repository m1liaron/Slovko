import { testData, changeTestData, authRequest } from "./testSetup.js";

describe("GROUP_ROUTES", () => {
    it("POST_GROUP", async () => {
        const res = await authRequest("post", "/groups", testData.testGroup);

        expect(res.status).toBe(200);
        expect(res.body.title).toBe(testData.testGroup.title);
        expect(res.body.userId).toBe(testData.userId);
    })

    it("GET_GROUPS", async () => {
        const res = await authRequest("get", "/groups", testData.testGroup);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
    })

    it("GET_GROUP", async () => {})
    it("PATCH_GROUP", async () => {})
    it("DELETE_GROUP", async () => { })
})