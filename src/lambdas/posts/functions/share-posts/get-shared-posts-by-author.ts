import { Responses } from "utils/serverless-responses";
import { IDynamoDB } from "database/dynamodb";
import diRegistry from "di/register";
import { APIGatewayEvent } from "aws-lambda";
import { ValidationResponses } from "utils/validation-reponse";
import getSharedPostsByAuthorSchema from "lambdas/posts/validation-schema/get-shared-posts-by-author-schema";
import STRINGS from "utils/texts";

interface PreviousKey {
  shared_post_id: string;
  post_id: string;
  author_id: string;
  created_at: string;
}

export default async function handler(event: APIGatewayEvent) {
  try {

    const authorId = event.pathParameters?.post_id;

    const isValid = ValidationResponses.validate(
      getSharedPostsByAuthorSchema,
      { authorId }
    );

    if (isValid.error) {
      return Responses._400({
        statusCode: 400,
        message: STRINGS.ERRORS.BODY_EMPTY,
        success: false,
      });
    }


    const ExclusiveStartKey: PreviousKey = JSON.parse(event.body as string);
    // requires primary keys of shared_post_id, author_id, post_id, created_at for offsetting.

    const entry: string | undefined = event.queryStringParameters?.entry;

    const condition = "author_id = :authorId";
    const parameters = {
      ":authorId": authorId,
    };
    const tableName = "shared_posts";
    const IndexName = "author_id-index";

    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");
    const userSharedPost = await database.getRecord(
      tableName,
      IndexName,
      condition,
      parameters,
      Number(entry),
      ExclusiveStartKey
    );

    const sharedPostKeys = userSharedPost.Items.map((post) => ({
      user_id: authorId,
      post_id: post.shared_post_id,
    }));

    const likedPostParams = {
      upvoted_posts: {
        Keys: sharedPostKeys,
      },
    };

    const likedSharedPosts = await database.getBatchItems(likedPostParams);

    return Responses._200({
      statusCode: 200,
      message: "success",
      data: [userSharedPost, likedSharedPosts],
    });

  } catch (error) {
    return Responses._500({
      statusCode: 500,
      message: STRINGS.ERRORS.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
}
