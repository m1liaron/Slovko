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
    changeTestData({ testCard: res.body });
  });

  it("POST_MANY_CARDS", async () => {
    const cards = [
      {
        word: "Apple",
        translateWord: "Яблуко",
        imageUri: "https://cdn.com/apple.png",
        groupId: testData.testGroup.id,
      },
      {
        word: "Banana",
        translateWord: "Банан",
        imageUri: "https://cdn.com/banana.png",
        groupId: testData.testGroup.id,
      },
    ];

    const res = await authRequest("post", "/cards/many", { cards });

    expect(res.status).toBe(201);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty("word", "Apple");
  });
    
    it("PATCH_CARD", async () => {
        const res = await authRequest("patch", `/cards/${testData.testCard.id}`, {
            word: "Updated word",
            groupId: testData.testGroup.id
        });

        expect(res.status).toBe(200);
        expect(res.body.word).toBe("Updated word");
    });

    it("DELETE_CARD", async () => {
        const res = await authRequest("delete", `/cards/${testData.testCard.id}`);

        expect(res.status).toBe(200);
        expect(res.body).toBe(testData.testCard.id);
    });
});
