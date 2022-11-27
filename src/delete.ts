import { DynamoDB } from "aws-sdk";

const db = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME || "";

export const handler = async (event: any = {}): Promise<any> => {
  // console.log("start function");
  // console.log(`this is the event: ${JSON.stringify(event)}`);
  // const idea = JSON.parse(event.pathParameters.name);
  // console.log(idea);

  // console.log(idea);

  const params = {
    TableName: TABLE_NAME,
    Key: { itemId: event.pathParameters.id || 'K'},
  };

  try {
    const result = await db.delete(params).promise();
    console.log(result)
    console.log(`this is the event: ${event}`)
    return { statusCode: 200, body: "deleted" };
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify(error) };
  }
};

// how to use use api end point www.example.com/root/Q
// for some reason it does not play nice with event.body 