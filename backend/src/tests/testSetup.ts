import request from "supertest";
import { app } from "../index.js";
import { sequelize } from "../db/sequelize.js";

const testData = {
  testUser: {
    email: "lani@gmail.com",
    name: "lani",
    password: "rty1245",
    points: 200,
    froze: 0
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

const authRequest = async (
  method: "get" | "post" | "put" | "patch" | "delete",
  path: string,
  data?: any
) => {
  let req = request(app)[method](path).set("Authorization", `Bearer ${testData.token}`);
  if (data) req = req.send(data);
  return req;
};

export { testData, changeTestData, authRequest };
