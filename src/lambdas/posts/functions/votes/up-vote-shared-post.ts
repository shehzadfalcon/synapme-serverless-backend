import { APIGatewayEvent } from "aws-lambda";
import countIncrease from "utils/count-increase";
import { ValidationResponses } from "utils/validation-reponse";
import upVoteSharedPost from "lambdas/posts/validation-schema/up-vote-shared-post-schema";
import { IDynamoDB } from "database/dynamodb";
import diRegistry from "di/register";
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

    const { sharedPostId, userId, createdAt, receiverId, payload } = body;
    const isValid = ValidationResponses.validate(upVoteSharedPost, body);

    if (isValid.error) {
      return Responses._400({
        statusCode: 400,
        message: isValid.data,
        success: false,
      });
    }
    const date = moment().toISOString();
    
    const upvoteSharedPostRecord = {
      user_id: userId,
      post_id: sharedPostId,
      created_at: date,
    };

    await countIncrease("shared_posts", "up_votes", {
      shared_post_id: sharedPostId,
      created_at: createdAt,
    });
   
    const database: IDynamoDB = diRegistry.resolve('DynamoDBRepository');

    await database.insert("upvoted_posts", upvoteSharedPostRecord);

    
    const notificationId = uuid();
    const title = "Upvote Shared Post"
    
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
      data: upvoteSharedPostRecord,
    });

  } catch (error) {
    return Responses._500({
      statusCode: 500,
      message: STRINGS.ERRORS.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
}
