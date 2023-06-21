import { Responses } from "utils/serverless-responses";
import moment from "moment";
import { uuid } from "uuidv4";
import { APIGatewayEvent } from "aws-lambda";
import { IDynamoDB } from "database/dynamodb";
import diRegistry from "di/register";
import { ValidationResponses } from "utils/validation-reponse";
import createPostSchema from "lambdas/posts/validation-schema/create-post-schema";
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
    
    const { authorId, content, media } = body;

    const isValid = ValidationResponses.validate(createPostSchema, body);

    if (isValid.error) {
      return Responses._400({
        statusCode: 400,
        message: isValid.data,
        success: false,
      });
    }

    const id = uuid();
    const date = moment().toISOString();

    const postRecord = {
      post_id: id,
      author_id: authorId,
      content,
      media: media ?? "",
      up_votes: 0,
      count_comments: 0,
      count_shares: 0,
      created_at: date,
      updated_at: date,
    };

  const tableName = "posts";

  const database: IDynamoDB = diRegistry.resolve('DynamoDBRepository');

  await database.insert(tableName, postRecord);

    return Responses._200({
      statusCode: 201,
      message: "created",
      data: postRecord,
    });

  } catch (error) {
    return Responses._500({
      statusCode: 500,
      message: STRINGS.ERRORS.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
}