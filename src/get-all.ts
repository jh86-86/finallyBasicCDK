import { DynamoDB } from "aws-sdk";

const db = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME || "";

export const handler = async (): Promise<any> => {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const response = await db.scan(params).promise();
    return { statusCode: 200, body: JSON.stringify(response.Items) };
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify(error) };
  }
};
