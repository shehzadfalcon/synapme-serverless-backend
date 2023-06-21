import { APIGatewayEvent } from "aws-lambda";
import countIncrease from "utils/count-increase";
import { ValidationResponses } from "utils/validation-reponse";
import createSharePostSchema from "lambdas/posts/validation-schema/create-share-post-schema";
import { uuid } from "uuidv4";
import { IDynamoDB } from "database/dynamodb";
import diRegistry from "di/register";
import moment from "moment";
import { Responses } from "utils/serverless-responses";
import STRINGS from "utils/texts";

export default async function handler(event: APIGatewayEvent) {
  try {
    const body = JSON.parse(event.body);

    if (!body || JSON.stringify(body) === "{}") {
      return Responses._400({
        statusCode: 400,
        message: STRINGS.ERRORS.BODY_EMPTY,
        success: false,
      });
    }

    const { commentId, createdAt, userId, receiverId, payload } = body;

    const isValid = ValidationResponses.validate(createSharePostSchema, body);

    if (isValid.error) {
      return Responses._400({
        statusCode: 400,
        message: isValid.data,
        success: false,
      });
    }

    const title = "Upvote Comment";

    const notificationId = uuid();

    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");
    const date = moment().toISOString();

    await countIncrease("comments", "up_votes", {
      comment_id: commentId,
      created_at: createdAt,
    });

    const upvoteCommentRecord = {
      user_id: userId,
      comment_id: commentId,
      created_at: date,
    };

    await database.insert("upvoted_comments", upvoteCommentRecord);

    await database.insert("notifications", {
      id: notificationId,
      sender_id: userId,
      receivers_id: [receiverId],
      title,
      content: [payload],
      created_at: date,
      updated_at: date,
      status: "unread",
    });

    return Responses._200({
      statusCode: 201,
      message: "created",
      data: Responses,
    });
  } catch (error) {
    return Responses._500({
      statusCode: 500,
      message: STRINGS.ERRORS.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
}
