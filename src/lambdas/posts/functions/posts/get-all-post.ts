import { Responses } from "utils/serverless-responses";
import { IDynamoDB } from "database/dynamodb";
import diRegistry from "di/register";
import { APIGatewayEvent } from "aws-lambda";
import STRINGS from "utils/texts";

export default async function handler(event: APIGatewayEvent) {
  try {
    const ExclusiveStartKey = JSON.parse(event.body as string);
    // optional
    const entry: string | undefined = event.queryStringParameters?.entry;
    // optional

    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");
    const allPosts = await database.getRecordWithFilter(
      "posts",
      null,
      null,
      null,
      null,
      null,
      entry ? Number(entry) : 10,
      ExclusiveStartKey
    );

    return Responses._200({
      statusCode: 200,
      message: "success",
      data: allPosts,
    });
  } catch (error) {
    return Responses._500({
      statusCode: 500,
      message: STRINGS.ERRORS.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
}
