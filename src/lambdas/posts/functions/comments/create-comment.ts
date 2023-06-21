import { Responses } from "utils/serverless-responses";
import moment from "moment";
import { uuid } from "uuidv4";
import { APIGatewayEvent } from "aws-lambda";
import countIncrease from "utils/count-increase";
import { IDynamoDB } from 'database/dynamodb';
import diRegistry from 'di/register';
import { IResponse } from "interfaces/api-gateway";
import { ValidationResponses } from "utils/validation-reponse";
import createCommentSchema from "lambdas/posts/validation-schema/create-comment-schema";
import STRINGS from "utils/texts";

export default async function handler(event: APIGatewayEvent): Promise<IResponse> {
  try {
    const body = JSON.parse(event.body);

    if (!body || JSON.stringify(body) === "{}") {
      return Responses._400({
        statusCode: 400,
        message: STRINGS.ERRORS.BODY_EMPTY,
        success: false,
      });
    }

    const isValid = ValidationResponses.validate(createCommentSchema, body);

    if (isValid.error) {
      return Responses._400({
        statusCode: 400,
        message: isValid.data,
        success: false,
      });
    }

    const { postId, createdAt, ...commentParams } = body;

    const condition = "post_id = :pk";
    const parameters = {
      ":pk": postId,
    };

    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");
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

    const { authorId, content , receiverId, payload } = commentParams;

    const id = uuid();
    const date = moment().toISOString();

    const commentRecord = {
      comment_id: id,
      post_id: postId,
      author_id: authorId,
      content,
      up_votes: 0,
      count_replies: 0,
      created_at: date,
    };

    const tableName = "comments";

    await countIncrease("posts", "count_comments", {
      post_id: postId,
      created_at: createdAt,
    });


    await database.insert(tableName, commentRecord);

    const title = 'Comment';
    
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
      statusCode: 200,
      message: "created",
      data: commentRecord,
    });
  } catch (error: any) {
    return Responses._500({
      statusCode: 500,
      message: STRINGS.ERRORS.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
}
