import { testData, authRequest } from "./testSetup.js";

const tenSecInMiliseconds = 10000;
const date = new Date();
const time = date.getTime() + tenSecInMiliseconds;
const newTime = new Date(time);

const TEST_RESULT = {
  title: testData.testGroup.title,
  startedLearn: new Date(),
  completionTime: newTime,
  flashCards: [
    {
      wordId: testData.testCard.id,
      word: testData.testCard.word,
      translateWord: testData.testCard.translateWord,
      mistakesAmount: 5,
    },
  ],
  guessWord: [
    {
      wordId: testData.testCard.id,
      word: testData.testCard.word,
      translateWord: testData.testCard.translateWord,
      mistakesAmount: 2,
    },
  ],
  quiz: [
    {
      wordId: testData.testCard.id,
      word: testData.testCard.word,
      translateWord: testData.testCard.translateWord,
      mistakesAmount: 0,
    },
  ],
};

describe("RESULT_ROUTES", async () => {
  it("POST_RESULT", async () => {
    const res = await authRequest("post", "/results", TEST_RESULT);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(TEST_RESULT.title);
  });

  it("GET_RESULTS", async () => {
    const res = await authRequest(
      "get",
      `/results?page=${0}&month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`,
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.results.length).toBe(1);
  });
});
