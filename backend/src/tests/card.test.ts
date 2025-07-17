import { testData, changeTestData, authRequest } from "./testSetup.js";

describe("CARD_ROUTES", () => {
  beforeAll(async () => {
    const res = await authRequest("post", "/groups", testData.testGroup);

    changeTestData({ testGroup: res.body });
  });

  it("POST_CARD", async () => {
    const res = await authRequest("post", "/cards", {
      ...testData.testCard,
      groupId: testData.testGroup.id,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.word).toBe(testData.testCard.word);
    expect(res.body.groupId).toBe(testData.testGroup.id);
  });
});
