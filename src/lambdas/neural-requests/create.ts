import { uuid } from "uuidv4";
import moment from "moment";
// import { insert, getRecord } from "../../libs/database-query";
import { Responses } from "utils/serverless-responses";
import { ValidationResponses } from "utils/validation-reponse";
import createSchema from "./validation-schema/create-schema";
import { APIGatewayEvent } from "aws-lambda";
import { IResponse } from "interfaces/api-gateway";
import STRINGS from "utils/texts";
import diRegistry from "di/register";
import { IDynamoDB } from "database/dynamodb";

const handler = async (event: APIGatewayEvent): Promise<IResponse> => {
  try {
    const body = JSON.parse(event.body);
    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");
    let sender_id = event.requestContext.authorizer.user_id;

    if (!body || JSON.stringify(body) === "{}") {
      return Responses._400({
        statusCode: 400,
        message: STRINGS.ERRORS.BODY_EMPTY,
        success: false,
      });
    }

    const isValid = ValidationResponses.validate(createSchema, body);

    if (isValid.error) {
      return Responses._400({
        statusCode: 400,
        message: isValid.data,
        success: false,
      });
    }

    const { neural_id, user_id } = body;
    const condition = "neural_id = :param";
    const parameters = {
      ":param": neural_id,
    };
    const alreadyExist: any = await database.getRecord(
      "neural",
      "neural_id",
      condition,
      parameters
    );

    if (alreadyExist.length <= 0) {
      return Responses._400({
        statusCode: 404,
        message: STRINGS.ERRORS.NEURAL_GROUP_NOT_EXISTS,
        success: false,
      });
    }
    const neural_request_condition = "user_id = :param";
    const neural_request_parameters = {
      ":param": user_id,
    };
    const neural_request_exist: any = await database.getRecord(
      "neural_requests",
      "user_id",
      neural_request_condition,
      neural_request_parameters
    );

    if (neural_request_exist.length > 0) {
      return Responses._400({
        statusCode: 400,
        message: STRINGS.ERRORS.NEURAL_GROUP_REQUEST_EXISTS,
        success: false,
      });
    }
    const neural_requests_id = uuid();

    const date = moment().toISOString();
    let data = {
      decision: STRINGS.STATUS.PENDING,
    };
    const user_record = {
      neural_requests_id,
      neural_id,
      user_id,
      ...data,
    };

    await database.insert("neural_requests", {
      ...user_record,
      created_at: date,
      updated_at: date,
    });
    const notification_id = uuid();

    await database.insert("notifications", {
      id: notification_id,
      sender_id: sender_id,
      receivers_id: user_id,
      title: STRINGS.NOTIFICATIONS.neural_request.CREATE_NEURAL_REQUEST.title,
      content: [STRINGS.NOTIFICATIONS.neural_request.CREATE_NEURAL_REQUEST],
      created_at: date,
      updated_at: date,
      status: "unread",
    });
    return Responses._200({
      statusCode: 200,
      message: STRINGS.TEXTS.NEURAL_GROUP_REQUEST_SENT,
      data: [{ neural_id }],
    });
  } catch (error) {
    return Responses._500({
      statusCode: 500,
      message: STRINGS.ERRORS.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
};

export default handler;
