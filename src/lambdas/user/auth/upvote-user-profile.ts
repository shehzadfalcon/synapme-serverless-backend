import { Responses } from "utils/serverless-responses";
import { ValidationResponses } from "utils/validation-reponse";
import upvoteProfileSchema from "../validation-schema/upvote-profile";
import { APIGatewayEvent } from "aws-lambda";
import { IResponse } from "interfaces/api-gateway";
import STRINGS from "utils/texts";
import { IDynamoDB } from "database/dynamodb";
import diRegistry from "di/register";
import { uuid } from "uuidv4";
import moment from "moment";

const handler = async (event: APIGatewayEvent): Promise<IResponse> => {
  try {
    const body = JSON.parse(event.body);
    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");

    let user_id = event.pathParameters.user_id;
    let sender_id = event.requestContext.authorizer.user_id;

    if (!body || JSON.stringify(body) === "{}") {
      return Responses._400({
        statusCode: 400,
        message: STRINGS.ERRORS.BODY_EMPTY,
        success: false,
      });
    }
    const isValid = ValidationResponses.validate(upvoteProfileSchema, body);

    if (isValid.error) {
      return Responses._400({
        statusCode: 400,
        message: isValid.data,
        success: false,
      });
    }

    const { count } = body;

    const condition = "user_id = :param";
    const parameters = {
      ":param": user_id,
    };

    let user: any = await database.getRecord(
      "users",
      "user_id",
      condition,
      parameters
    );

    if (user.length <= 0) {
      return Responses._400(STRINGS.ERRORS.USER_NOT_EXISTS);
    }
    let UpdateExpression;
    let ExpressionAttributeValues;
    if (count == 1) {
      UpdateExpression = "ADD totalVotes :incr";
      ExpressionAttributeValues = {
        ":incr": 1,
      };
    } else if (count == 0) {
      UpdateExpression = "ADD totalVotes :incr";
      ExpressionAttributeValues = {
        ":incr": -1,
      };
    }

    let conditionExpression = {
      user_id: user_id,
    };
    const date = moment().toISOString();

    user = await database.updateRecord(
      "users",
      conditionExpression,
      UpdateExpression,
      ExpressionAttributeValues
    );
    const notification_id = uuid();

    await database.insert("notifications", {
      id: notification_id,
      sender_id: sender_id,
      receivers_id: user_id,
      title: STRINGS.NOTIFICATIONS.user.UPVOTE.title,
      content: [STRINGS.NOTIFICATIONS.user.UPVOTE],
      created_at: date,
      updated_at: date,
      status: "unread",
    });
    return Responses._200({
      statusCode: 200,
      message: STRINGS.TEXTS.ACCOUNT_UPVOTED,
      success: user,
    });
  } catch (error) {
    console.log("Upvote user error-->", error);
    return Responses._500({
      statusCode: 500,
      message: STRINGS.ERRORS.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
};
export default handler;
