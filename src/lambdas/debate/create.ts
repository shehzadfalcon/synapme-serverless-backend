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
    let challenger_id = event.requestContext.authorizer.user_id;

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

    const { topic, description, opponent_id, affirmative, negative } = body;
    const user_condition =
      "challenger_id = :param AND opponent_id = :param_opp,";
    const user_parameters = {
      ":param": challenger_id.toLowerCase(),
      ":param_opp": opponent_id.toLowerCase(),
    };
    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");

    const isDebateExist: any = await database.getRecord(
      "debate",
      "",
      user_condition,
      user_parameters
    );
    if (isDebateExist.length <= 0) {
      return Responses._400(STRINGS.ERRORS.USER_NOT_EXISTS);
    }

    const debate_id = uuid();

    const date = moment().toISOString();

    const debate_record = {
      debate_id,
      topic,
      description,
      affirmative,
      negative,
      opponent_id,
      challenger_id,
    };

    await database.insert("debate", {
      ...debate_record,
      created_at: date,
      updated_at: date,
    });
    // await sendNotification(
    //   user_id,
    //   STRINGS.NOTIFICATIONS.neural.CREATE_NEURAL_GROUP
    // );
    // const notification_id = uuid();

    // await database.insert("notifications", {
    //   id: notification_id,
    //   sender_id: challenger_id,
    //   receivers_id: oponnent_id,
    //   title: STRINGS.NOTIFICATIONS.debate.CREATE.title,
    //   content: [STRINGS.NOTIFICATIONS.debate.CREATE],
    //   created_at: date,
    //   updated_at: date,
    //   status: "unread",
    // });
    return Responses._200({
      statusCode: 200,
      message: STRINGS.TEXTS.DEBATE_REQUEST_SENT,
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
