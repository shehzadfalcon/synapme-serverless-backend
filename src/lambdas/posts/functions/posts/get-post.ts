import { Responses } from "utils/serverless-responses";
import { IDynamoDB } from "database/dynamodb";
import diRegistry from "di/register";
import { APIGatewayEvent } from "aws-lambda";
import { ValidationResponses } from "utils/validation-reponse";
import getPostSchema from "lambdas/posts/validation-schema//get-post-schema";
import STRINGS from "utils/texts";

export default async function handler(event: APIGatewayEvent) {
  try {
    const postId = event.pathParameters?.post_id;

    const isValid = ValidationResponses.validate(
      getPostSchema,
      { postId }
    );

    if (isValid.error) {
      return Responses._400({
        statusCode: 400,
        message: isValid.data,
        success: false,
      });
    }
    
    const condition = "post_id = :pk";
    const parameters = {
      ":pk": postId,
    };
    const tableName = "posts";

    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");
    const singlePost = await database.getRecord(
      tableName,
      "",
      condition,
      parameters
    );

    return Responses._200({
      statusCode: 200,
      message: "success",
      data: singlePost,
    });
  } catch (error) {
    return Responses._500({
      statusCode: 500,
      message: STRINGS.ERRORS.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
}
