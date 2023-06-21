import { Responses } from "utils/serverless-responses";
import diRegistry from "di/register";
import { IDynamoDB } from "database/dynamodb";
import STRINGS from "utils/texts";
import { APIGatewayEvent } from "aws-lambda";

import { IResponse } from "interfaces/api-gateway";

const handler = async (event: APIGatewayEvent): Promise<IResponse> => {
  try {
    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");
    let user_id = event.pathParameters.id;

    const condition = "leader_id = :param";
    const parameters = {
      ":param": user_id,
    };

    let user = await database.getRecord(
      "neural",
      "leader_id",
      condition,
      parameters
    );

    return Responses._200({
      statusCode: 200,
      message: STRINGS.TEXTS.NEURAL_GROUP_REQUESTS,
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
