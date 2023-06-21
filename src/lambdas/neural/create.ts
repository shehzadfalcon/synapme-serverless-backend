import { uuid } from "uuidv4";
import moment from "moment";
import { Responses } from "utils/serverless-responses";
import { ValidationResponses } from "utils/validation-reponse";
import createNeuralSchema from "./validation-schema/create-schema";
import { APIGatewayEvent } from "aws-lambda";
import { IResponse } from "interfaces/api-gateway";
import STRINGS from "utils/texts";
import diRegistry from "di/register";
import { IDynamoDB } from "database/dynamodb";

const handler = async (event: APIGatewayEvent): Promise<IResponse> => {
  try {
    const body = JSON.parse(event.body);
    let user_id = event.requestContext.authorizer.user_id;
    if (!body || JSON.stringify(body) === "{}") {
      return Responses._400({
        statusCode: 400,
        message: STRINGS.ERRORS.BODY_EMPTY,
        success: false,
      });
    }

    const isValid = ValidationResponses.validate(createNeuralSchema, body);

    if (isValid.error) {
      return Responses._400({
        statusCode: 400,
        message: isValid.data,
        success: false,
      });
    }

    const { title, description, leader_id } = body;
    const user_condition = "user_id = :param";
    const user_parameters = {
      ":param": leader_id.toLowerCase(),
    };
    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");

    const isUserExist: any = await database.getRecord(
      "users",
      "user_id",
      user_condition,
      user_parameters
    );
    if (isUserExist.length <= 0) {
      return Responses._400(STRINGS.ERRORS.USER_NOT_EXISTS);
    }
    // const neural_title_condition = "title = :param";
    // const neural_title_parameters = {
    //   ":param": title.toLowerCase(),
    // };
    // const isTitleExist = await database.getRecord(
    //   "neural",
    //   "title",
    //   neural_title_condition,
    //   neural_title_parameters
    // );

    // if (isTitleExist.length > 0) {
    //   return Responses._400(STRINGS.ERRORS.NEURAL_GROUP_TITLE_EXISTS);
    // }

    const neural_id = uuid();

    const date = moment().toISOString();

    const user_record = {
      neural_id,
      title,
      description,
      leader_id,
    };

    await database.insert("neural", {
      ...user_record,
      created_at: date,
      updated_at: date,
    });
    // await sendNotification(
    //   user_id,
    //   STRINGS.NOTIFICATIONS.neural.CREATE_NEURAL_GROUP
    // );
    const notification_id = uuid();

    await database.insert("notifications", {
      id: notification_id,
      sender_id: leader_id,
      receivers_id: user_id,
      title: STRINGS.NOTIFICATIONS.neural.CREATE_NEURAL_GROUP.title,
      content: [STRINGS.NOTIFICATIONS.neural.CREATE_NEURAL_GROUP],
      created_at: date,
      updated_at: date,
      status: "unread",
    });
    return Responses._200({
      statusCode: 200,
      message: STRINGS.TEXTS.NEURAL_GROUP_CREATED,
      data: [{ neural_id }],
    });
  } catch (error) {
    console.log(error, "Error");
    return Responses._500({
      statusCode: 500,
      message: STRINGS.ERRORS.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
};
export default handler;
