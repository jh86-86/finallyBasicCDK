import { DynamoDB } from "aws-sdk";

const db = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME || "";
const PRIMARY_KEY = process.env.PRIMARY_KEY || "";

export const handler = async (event: any = {}): Promise<any> => {

  const params = {
    TableName: TABLE_NAME,
    Key: { itemId : event.pathParameters.id || 'M' },
  };

  try {
    const result = await db.get(params).promise();
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify(error) };
  }
};