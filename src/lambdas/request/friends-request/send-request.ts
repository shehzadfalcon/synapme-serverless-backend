import { uuid } from "uuidv4";
import moment from "moment";
import { APIGatewayEvent } from "aws-lambda";
import { Responses } from "utils/serverless-responses";
import { ErrorResponses } from "utils/serverless-error-response";
import { IResponse } from "interfaces/api-gateway";
import { ValidationResponses } from "utils/validation-reponse";
import { invokeLambda } from "services/lambda";
import friendRequestSchema from "lambdas/request/validation/friend-request-schema";
import diRegistry from "di/register";
import { IDynamoDB } from "database/dynamodb";

const custom_errors = [
  "Request body is empty",
  "Missing fields is required",
  "Invalid request payload",
  "Friend request sent successfully",
  "Lambda function invocation",
  "Internal server error",
];

const handler = async (event: APIGatewayEvent): Promise<IResponse> => {
  try {
    const body = JSON.parse(event.body);

    if (!body || JSON.stringify(body) === "{}") {
      throw ErrorResponses._400(`${custom_errors[0]}`);
    }

    const isValid = ValidationResponses.validate(friendRequestSchema, body);

    if (isValid.error) {
      throw ErrorResponses._400("Invalid request payload", isValid.data);
    }

    const all_fields = Object.keys(body);
    const required_fields = ["receiverID", "payload"];

    const missing_fields = required_fields.filter(
      (field: string): boolean => !all_fields.includes(field)
    );

    if (missing_fields.length > 0) {
      throw ErrorResponses._400(`${custom_errors[1]}`, missing_fields);
    }

    const title = "Friend request";
    const { receiverID, payload } = body;

    await invokeLambda(
      process.env.NOTIFICATION_TRIGGER_URL,
      JSON.stringify({
        headers: {
          Authorization: event.headers.Authorization,
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title,
          receiversID: [receiverID],
          payload,
        }),
        requestContext: {
          authorizer: {
            user_id: event.requestContext.authorizer["user_id"],
          },
        },
      })
    );

    const userID = event.requestContext.authorizer["user_id"];
    const date = moment().toISOString();
    const friend_request_id = uuid();
    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");

    await database.insert("friend_requests", {
      id: friend_request_id,
      user_id: userID,
      request_id: receiverID,
      created_at: date,
      updated_at: date,
      status: "pending",
    });

    return Responses._200({
      statusCode: 200,
      message: custom_errors[3],
      data: [],
    });
  } catch (error) {
    if (error?.type === custom_errors[4]) {
      return Responses._400({
        statusCode: 400,
        message: "Friend request failed to send",
        data: [],
      });
    }

    if (custom_errors.includes(error.message)) {
      return Responses._400(error);
    }

    throw Responses._500({
      statusCode: 500,
      message: custom_errors[5],
      data: [],
    });
  }
};

export default handler;
