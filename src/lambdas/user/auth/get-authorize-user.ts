// import { getAllRecord } from "../../../libs/database-query";
import { Responses } from "utils/serverless-responses";

import { IResponse } from "interfaces/api-gateway";
import { IDynamoDB } from "database/dynamodb";
import diRegistry from "di/register";
import { APIGatewayEvent } from "aws-lambda";
import STRINGS from "utils/texts";

const handler = async (event: APIGatewayEvent): Promise<IResponse> => {
  try {
    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");
    let user_id = event.requestContext.authorizer.user_id;

    const condition = "user_id = :param";
    const parameters = {
      ":param": user_id,
    };
    const select_parameters = {
      select: "SPECIFIC_ATTRIBUTES",
      attributes:
        "user_id,gender,date_of_birth,user_name,created_at,last_name,profile_image_url,background,totalVotes,first_name,email",
    };
    let user = await database.getRecord(
      "users",
      "user_id",
      condition,
      parameters,
      0,
      undefined,
      select_parameters.select,
      select_parameters.attributes
    );

    return Responses._200({
      statusCode: 200,
      message: STRINGS.TEXTS.USER_FETCHED,
      success: user,
    });
  } catch (error) {
    console.log(error);
    return Responses._500(STRINGS.ERRORS.INTERNAL_SERVER_ERROR);
  }
};

export default handler;
