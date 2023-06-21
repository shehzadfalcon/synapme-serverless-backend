import { Responses } from "utils/serverless-responses";
import { IDynamoDB } from "database/dynamodb";
import diRegistry from "di/register";
import { APIGatewayEvent } from "aws-lambda";
import { ValidationResponses } from "utils/validation-reponse";
import getCommentValidation from "lambdas/posts/validation-schema/get-comment-schema";
import STRINGS from "utils/texts";

export default async function handler(event: APIGatewayEvent) {
  try {
    const commentId = event.pathParameters?.comment_id;

    const isValid = ValidationResponses.validate(
      getCommentValidation,
      { commentId }
    );

    if (isValid.error) {
      return Responses._400({
        statusCode: 400,
        message: isValid.data,
        success: false,
      });
    }
    
    const condition = "comment_id = :pk";
    const parameters = {
      ":pk": commentId,
    };

    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");
    const singleComment = await database.getRecord(
      "comments",
      "",
      condition,
      parameters
    );

    return Responses._200({
      statusCode: 200,
      message: "success",
      data: singleComment,
    });
  } catch (error) {
    return Responses._500({
      statusCode: 500,
      message: STRINGS.ERRORS.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
}
