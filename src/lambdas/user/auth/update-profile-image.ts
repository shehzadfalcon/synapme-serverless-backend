import moment from "moment";
// import { getRecord, updateRecord } from "../../../libs/database-query";
import { Responses } from "utils/serverless-responses";
// import { ErrorResponses } from "utils/serverless-error-response";
import { ValidationResponses } from "utils/validation-reponse";
import updateProfileImageSchema from "../validation-schema/update-profile-image-schema";
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
    const isValid = ValidationResponses.validate(
      updateProfileImageSchema,
      body
    );

    if (isValid.error) {
      return Responses._400({
        statusCode: 400,
        message: isValid.data,
        success: false,
      });
    }

    const { profile_image_url } = body;

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
      return Responses._400(STRINGS.ERRORS.USER_NOT_EXISTS);
    }
    const date = moment().toISOString();

    let UpdateExpression = "set profile_image_url = :un,updated_at=:ua";
    let ExpressionAttributeValues = {
      ":un": `${profile_image_url}`,
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
      message: STRINGS.TEXTS.PROFILE_PHOTO_UPDATED,
      success: user,
    });
  } catch (error) {
    console.log("Profile image error-->", error);
    return Responses._500({
      statusCode: 500,
      message: STRINGS.ERRORS.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
};
export default handler;
