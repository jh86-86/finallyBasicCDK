import { DynamoDB } from "aws-sdk";

const db = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME || "";
const PRIMARY_KEY = process.env.PRIMARY_KEY || "";

export const handler = async (event: any = {}): Promise<any> => {
//   const item =JSON.parse(event.body);
//   const ID = String.fromCharCode(64 + Math.floor(Math.random() * 26));

//   item[PRIMARY_KEY] = ID;

//   const params = {
//     TableName: TABLE_NAME,
//     KEY: {item},
//   };

  try {
    // await db.update(params).promise();
    return { statusCode: 200, body: JSON.stringify(event.body) };
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify(error) };
  }
};
