import { Responses } from "utils/serverless-responses";
import { IDynamoDB } from "database/dynamodb";
import diRegistry from "di/register";
import { APIGatewayEvent } from "aws-lambda";
import { ValidationResponses } from "utils/validation-reponse";
import getPostsByAuthorSchema from "lambdas/posts/validation-schema/get-posts-by-author-schema";
import STRINGS from "utils/texts";

interface PreviousKey {
  author_id: string;
  post_id: string;
  created_at: string;
}

export default async function handler(event: APIGatewayEvent) {
  try {
    const authorId = event.pathParameters?.author_id;

    const isValid = ValidationResponses.validate(
      getPostsByAuthorSchema,
      { authorId }
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

    const condition = "author_id = :authorId";
    const parameters = {
      ":authorId": authorId,
    };
    const tableName = "posts";
    const IndexName = "author_id-index";

    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");
    const userPosts = await database.getRecord(
      tableName,
      IndexName,
      condition,
      parameters,
      Number(entry),
      ExclusiveStartKey
    );

    const likedPostKeys = userPosts.Items.map((post) => ({
      user_id: authorId,
      post_id: post.post_id,
    }));

    const likedPostParams = {
      upvoted_posts: {
        Keys: likedPostKeys,
      },
    };

    const likedPosts = await database.getBatchItems(likedPostParams);

    return Responses._200({
      statusCode: 200,
      message: "success",
      data: [userPosts,likedPosts],
    });
  } catch (error) {
    return Responses._500({
      statusCode: 500,
      message: STRINGS.ERRORS.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
}
