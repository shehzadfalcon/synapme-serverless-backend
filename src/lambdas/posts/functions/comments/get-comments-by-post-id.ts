import { Responses } from "utils/serverless-responses";
import { IDynamoDB } from "database/dynamodb";
import diRegistry from "di/register";
import { APIGatewayEvent } from "aws-lambda";
import { ValidationResponses } from "utils/validation-reponse";
import getCommentsByPostId from "lambdas/posts/validation-schema/get-comments-by-post-id-schema";
import STRINGS from "utils/texts";

interface PreviousKey {
  comment_id: string;
  author_id: string;
  post_id: string;
  created_at: string;
}

export default async function handler(event: APIGatewayEvent) {
  try {

  const postId = event.pathParameters?.post_id;

    const isValid = ValidationResponses.validate(
      getCommentsByPostId,
      { postId }
    );

    if (isValid.error) {
      return Responses._400({
        statusCode: 400,
        message: isValid.data,
        success: false,
      });
    }
    const ExclusiveStartKey: PreviousKey = JSON.parse(event.body as string);
    // requires primary keys of author_id, post_id, created_at for offsetting.

    const entry: string | undefined = event.queryStringParameters?.entry;

    const condition = "post_id = :postId";
    const parameters = {
      ":postId": postId,
    };
    const tableName = "comments";
    const IndexName = "post_id-index"

    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");
    const postComments = await database.getRecord(
      tableName,
      IndexName,
      condition,
      parameters,
      Number(entry),
      ExclusiveStartKey
    );

    const user_id = event.requestContext.authorizer.user_id;

    const likedCommentKeys = postComments.Items.map((comment) => ({
      user_id,
      comment_id: comment.comment_id,
    }));

    const likedPostParams = {
      upvoted_posts: {
        Keys: likedCommentKeys,
      },
    };

    const likedComments = await database.getBatchItems(likedPostParams);

    return Responses._200({
      statusCode: 200,
      message: "success",
      data: [postComments, likedComments],
    });

  } catch (error) {
    return Responses._500({
      statusCode: 500,
      message: STRINGS.ERRORS.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
}