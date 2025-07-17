import request from "supertest";
import { app } from "../index.js";
import { sequelize } from "../db/sequelize.js";

interface ITestData {
  testUser: {
    email: string;
    name: string;
    password: string;
    points: number;
    froze: number;
  };
  testGroup: {
    id?: string;
    title: string;
  };
  token: string;
  userId: string;
}

const testData: ITestData = {
  testUser: {
    email: "lani@gmail.com",
    name: "lani",
    password: "rty1245",
    points: 200,
    froze: 0,
  },
  testGroup: {
    title: "New Group",
  },
  token: "",
  userId: "",
};

const changeTestData = (updates: Partial<typeof testData>) => {
  Object.assign(testData, updates);
};

beforeAll(async () => {
  await sequelize.sync({ force: true });

  await request(app).post("/users/register").send(testData.testUser);
  const res = await request(app).post("/users/login").send({
    email: testData.testUser.email,
    password: testData.testUser.password,
  });

  changeTestData({ token: res.body.token });
  changeTestData({ userId: res.body.userId });
});

afterAll(async () => {
  await sequelize.close();
});

type ITestDataField = ITestData[keyof ITestData];

const authRequest = async (
  method: "get" | "post" | "put" | "patch" | "delete",
  path: string,
  data?: Partial<ITestDataField>,
) => {
  const reqFn = request(app)[method];
  let req = reqFn(path).set("Authorization", `Bearer ${testData.token}`);
  if (data) req = req.send(data);
  return req;
};

export { testData, changeTestData, authRequest };
