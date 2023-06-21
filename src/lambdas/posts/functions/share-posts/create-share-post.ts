import { Responses } from "utils/serverless-responses";
import moment from "moment";
import { uuid } from "uuidv4";
import { APIGatewayEvent } from "aws-lambda";
import { IDynamoDB } from "database/dynamodb";
import diRegistry from "di/register";
import countIncrease from "utils/count-increase";
import createSharePostSchema from "lambdas/posts/validation-schema/create-share-post-schema";
import { ValidationResponses } from "utils/validation-reponse";
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

    const { postId, authorId, description, createdAt, receiverId, payload } = body;

    const isValid = ValidationResponses.validate(createSharePostSchema, body);

    if (isValid.error) {
      return Responses._400({
        statusCode: 400,
        message: isValid.data,
        success: false,
      });
    }

    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");

    const condition = "post_id = :pk";
    const parameters = {
      ":pk": postId,
    };

    const singlePost = await database.getRecord(
      "posts",
      "",
      condition,
      parameters
    );

    if(!singlePost.Items.length){
      return Responses._400({
        statusCode: 400,
        message: STRINGS.ERRORS.USER_POST_REQUEST_NOT_EXISTS,
        success: false,
      });
    }

    const id = uuid();
    const date = moment().toISOString();

    const sharedPostRecord = {
      shared_post_id: id,
      post_id: postId,
      author_id: authorId,
      description,
      up_votes: 0,
      count_comments: 0,
      created_at: date,
    };

    const tableName = "shared_posts";

    await countIncrease("posts", "count_shares", {
      post_id: postId,
      created_at: createdAt,
    });

    await database.insert(tableName, sharedPostRecord);

    const title = 'Share Post';
    
    const notificationId = uuid();

    await database.insert('notifications', {
      id: notificationId,
      sender_id: authorId,
      receivers_id: [receiverId],
      title,
      content: [payload],
      created_at: date,
      updated_at: date,
      status: 'unread',
    });

    return Responses._200({
      statusCode: 201,
      message: "created",
      data: sharedPostRecord,
    });
  } catch (error) {
    return Responses._500({
      statusCode: 500,
      message: STRINGS.ERRORS.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
}
