import moment from "moment";
// import { getRecord, updateRecord } from "../../../libs/database-query";
import { Responses } from "utils/serverless-responses";
// import { ErrorResponses } from "utils/serverless-error-response";
import { ValidationResponses } from "utils/validation-reponse";
import updateUserSchema from "../validation-schema/update-user";
import { APIGatewayEvent } from "aws-lambda";
import { IResponse } from "interfaces/api-gateway";
import STRINGS from "utils/texts";
import { IDynamoDB } from "database/dynamodb";
import diRegistry from "di/register";

const handler = async (event: APIGatewayEvent): Promise<IResponse> => {
  try {
    const body = JSON.parse(event.body);
    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");

    let user_id = event.pathParameters.id;

    if (!body || JSON.stringify(body) === "{}") {
      return Responses._400({
        statusCode: 400,
        message: STRINGS.ERRORS.BODY_EMPTY,
        success: false,
      });
    }
    const isValid = ValidationResponses.validate(updateUserSchema, body);

    if (isValid.error) {
      return Responses._400({
        statusCode: 400,
        message: isValid.data,
        success: false,
      });
    }

    const {
      user_name,
      first_name,
      last_name,
      date_of_birth,
      gender,
      background,
    } = body;

    const condition = "user_id = :param";
    const parameters = {
      ":param": user_id,
    };
    let user: any = await database.getRecord(
      "users",
      "",
      condition,
      parameters
    );
    if (user.length <= 0) {
      return Responses._400({
        statusCode: 400,
        message: STRINGS.ERRORS.USER_NOT_EXISTS,
        success: false,
      });
    }
    const date = moment().toISOString();

    let UpdateExpression =
      "set background=:bg,totalVotes=:tv,user_name = :un, first_name = :fn , last_name=:ln,gender=:g,date_of_birth=:dob,updated_at=:ua";
    let ExpressionAttributeValues = {
      ":un": `${user_name}`,
      ":fn": `${first_name}`,
      ":ln": `${last_name}`,
      ":g": `${gender}`,
      ":bg": background ? background : user[0].background,

      ":tv": `${user[0].totalVotes}`,
      ":dob": `${date_of_birth}`,
      ":ua": `${date}`,
    };
    let conditionExpression = {
      user_id: user_id,
    };
    user = await database.updateRecord(
      "users",
      conditionExpression,
      UpdateExpression,
      ExpressionAttributeValues
    );
    return Responses._200({
      statusCode: 200,
      message: STRINGS.TEXTS.ACCOUNT_UPDATED,
      success: user,
    });
  } catch (error) {
    console.log(error);
    return Responses._500({
      statusCode: 500,
      message: STRINGS.ERRORS.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
};

export default handler;
