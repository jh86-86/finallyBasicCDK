import { DynamoDB } from "aws-sdk";

const db = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME || "";
const PRIMARY_KEY = process.env.PRIMARY_KEY || "";

export const handler = async (event: any = {}): Promise<any> => {
  const item =JSON.parse(event.body);


  const params = {
    TableName: TABLE_NAME,
    Item: {itemId: item.id, test: item.test},
  };

  try {
    await db.put(params).promise();
    return { statusCode: 200, body: `${item.id} was updated` };
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify(error) };
  }
};
