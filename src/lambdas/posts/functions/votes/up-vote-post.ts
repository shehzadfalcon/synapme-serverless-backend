import { APIGatewayEvent } from "aws-lambda";
import countIncrease from "utils/count-increase";
import { IDynamoDB } from "database/dynamodb";
import diRegistry from "di/register";
import { ValidationResponses } from "utils/validation-reponse";
import upVotePostSchema from "lambdas/posts/validation-schema/up-vote-post-schema";
import { Responses } from "utils/serverless-responses";
import moment from "moment";
import { uuid } from "uuidv4";
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

    const { userId, postId, createdAt, receiverId, payload } = body;

    const isValid = ValidationResponses.validate(upVotePostSchema, body);

    if (isValid.error) {
      return Responses._400({
        statusCode: 400,
        message: isValid.data,
        success: false,
      });
    }

    const date = moment().toISOString();

    const upvotePostRecord = {
      user_id: userId,
      post_id: postId,
      created_at: date,
    };

    const tableName = "posts";
    const attributeName = "up_votes";

    await countIncrease(tableName, attributeName, {
      post_id: postId,
      created_at: createdAt,
    });

    const database: IDynamoDB = diRegistry.resolve('DynamoDBRepository');

    await database.insert("upvoted_posts", upvotePostRecord);

    const notificationId = uuid();
    const title = "Upvote Post"
    
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
      data: upvotePostRecord,
    });

  } catch (error) {
    return Responses._500({
      statusCode: 500,
      message: STRINGS.ERRORS.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
}
