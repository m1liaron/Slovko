import { Group } from "../../models/Group.js";
import { Card, Result } from "../../models/models.js";
import { Section } from "../../models/Section.js";
import { User } from "../../models/User.js";

interface IResult {
  id: string;
  title: string;
  userId: string;
  startedLearn: Date;
  completionTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

const fakeUser = {
  name: "Fake User 1",
  email: "fakeuser@gmail.com",
  password: "secret45",
};

const IDS = {
  userId: "11111111-1111-1111-1111-111111111111",

  section1Id: "22222222-2222-2222-2222-222222222221",
  section2Id: "22222222-2222-2222-2222-222222222222",

  group1Id: "33333333-3333-3333-3333-333333333331",
  group2Id: "33333333-3333-3333-3333-333333333332",
};

const sections = [
  {
    id: IDS.section1Id,
    title: "English Basics",
    userId: IDS.userId,
    languageId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: IDS.section2Id,
    title: "English Advanced",
    userId: IDS.userId,
    languageId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const groups = [
  {
    id: IDS.group1Id,
    title: "Basics – Group 1",
    sectionId: IDS.section1Id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: IDS.group2Id,
    title: "Advanced – Group 1",
    sectionId: IDS.section2Id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const today = new Date();

function generateCards(groupId: string, prefix: string) {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `${prefix}-card-${i + 1}`,
    word: `${prefix}_word_${i + 1}`,
    translateWord: `${prefix}_translate_${i + 1}`,
    groupId,
    imageId: null,
    status: i < 10 ? "Learned" : "To Learn",
    definition: `Definition for ${prefix}_word_${i + 1}`,
    example: `Example with ${prefix}_word_${i + 1}`,
    learnedAt: i < 10 ? today : null,
    nextReviewAt: i < 10 ? today : null,
    reviewCount: i < 10 ? 3 : 0,
    createdAt: today,
    updatedAt: today,
  }));
}

const cards = [
  ...generateCards(IDS.group1Id, "basic"),
  ...generateCards(IDS.group2Id, "advanced"),
];

const results: IResult[] = [];
const resultModes = [];
const wordResults = [];

const now = new Date();

for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
  for (let i = 0; i < 5; i++) {
    const resultId = `result-${monthOffset}-${i}`;
    const modeId = `mode-${monthOffset}-${i}`;

    const started = new Date(
      now.getFullYear(),
      now.getMonth() - monthOffset,
      5 + i,
      10,
      0,
      0,
    );

    const finished = new Date(started.getTime() + 5 * 60 * 1000);

    results.push({
      id: resultId,
      title: `Session ${i + 1} (${monthOffset + 1} month ago)`,
      userId: IDS.userId,
      startedLearn: started,
      completionTime: finished,
      createdAt: finished,
      updatedAt: finished,
    });

    resultModes.push({
      id: modeId,
      mode: "flashCards",
      resultId,
      createdAt: finished,
      updatedAt: finished,
    });

    wordResults.push(
      {
        id: `wr-${monthOffset}-${i}-1`,
        resultModeId: modeId,
        word: "hello",
        translate: "привіт",
        mistakesAmount: 0,
        createdAt: finished,
        updatedAt: finished,
      },
      {
        id: `wr-${monthOffset}-${i}-2`,
        resultModeId: modeId,
        word: "world",
        translate: "світ",
        mistakesAmount: 1,
        createdAt: finished,
        updatedAt: finished,
      },
    );
  }
}

const createFakeData = async () => {
  const user = await User.create(fakeUser);

  Promise.all(
    (await sections).map((section) => {
      Section.create({ ...section, userId: user.id });
    }),
  );

  Promise.all(
    (await groups).map((group) => {
      Group.create(group);
    }),
  );

  Promise.all(
    (await results).map((result) => {
      Result.create({ ...result, userId: user.id });
    }),
  );

  Promise.all(
    (await cards).map((card) => {
      Card.create(card);
    }),
  );
};

export { createFakeData };
