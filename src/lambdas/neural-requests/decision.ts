import moment from "moment";
import { Responses } from "utils/serverless-responses";
import { ValidationResponses } from "utils/validation-reponse";
import decisionSchema from "./validation-schema/decision-schema";
import { APIGatewayEvent } from "aws-lambda";
import { IResponse } from "interfaces/api-gateway";
import STRINGS from "utils/texts";
import diRegistry from "di/register";
import { IDynamoDB } from "database/dynamodb";
import { uuid } from "uuidv4";

const handler = async (event: APIGatewayEvent): Promise<IResponse> => {
  try {
    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");
    let user_id = event.requestContext.authorizer.user_id;

    const body = JSON.parse(event.body);
    if (!body || JSON.stringify(body) === "{}") {
      return Responses._400({
        statusCode: 400,
        message: STRINGS.ERRORS.BODY_EMPTY,
        success: false,
      });
    }

    const isValid = ValidationResponses.validate(decisionSchema, body);

    if (isValid.error) {
      return Responses._400({
        statusCode: 400,
        message: isValid.data,
        success: false,
      });
    }

    const { neural_requests_id } = body;
    const condition = "neural_requests_id = :param";
    const parameters = {
      ":param": neural_requests_id,
    };
    //check if neural_request exists
    const neural_requests_exist: any = await database.getRecord(
      "neural_requests",
      "neural_requests_id",
      condition,
      parameters
    );

    if (neural_requests_exist.length <= 0) {
      return Responses._400({
        statusCode: 404,
        message: STRINGS.ERRORS.NEURAL_GROUP_REQUEST_NOT_EXISTS,
        success: false,
      });
    }

    let neural_id = neural_requests_exist.Items[0].neural_id;

    // check if neural group exist
    const neural_condition = "neural_id = :param";
    const neural_parameters = {
      ":param": neural_id,
    };
    const neural_group_exist: any = await database.getRecord(
      "neural",
      "neural_id",
      neural_condition,
      neural_parameters
    );
    if (neural_group_exist.length <= 0) {
      return Responses._400({
        statusCode: 404,
        message: STRINGS.ERRORS.NEURAL_GROUP_NOT_EXISTS,
        success: false,
      });
    }
    let leader_id = neural_group_exist.Items[0].leader_id;

    // ***********

    const { decision } = body;
    const date = moment().toISOString();
    let UpdateExpression = "set decision =:st,updated_at=:ua";
    let ExpressionAttributeValues = {
      ":st": `${decision}`,
      ":ua": `${date}`,
    };

    let conditionExpression = {
      neural_requests_id: neural_requests_id,
    };
    await database.updateRecord(
      "neural_requests",
      conditionExpression,
      UpdateExpression,
      ExpressionAttributeValues
    );

    //notification
    const notification_id = uuid();

    await database.insert("notifications", {
      id: notification_id,
      sender_id: user_id,
      receivers_id: leader_id,
      title: STRINGS.NOTIFICATIONS.neural.CREATE_NEURAL_GROUP.title,
      content: [STRINGS.NOTIFICATIONS.neural.CREATE_NEURAL_GROUP],
      created_at: date,
      updated_at: date,
      status: "unread",
    });
    return Responses._200({
      statusCode: 200,
      message: STRINGS.TEXTS.NEURAL_GROUP_REQUESTS_DECISION,
    });
  } catch (error) {
    console.log(error, "error");
    return Responses._500({
      statusCode: 500,
      message: STRINGS.ERRORS.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
};

export default handler;
