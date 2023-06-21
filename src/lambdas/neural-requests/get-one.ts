import { Responses } from "utils/serverless-responses";
import { APIGatewayEvent } from "aws-lambda";
import STRINGS from "utils/texts";
import diRegistry from "di/register";
import { IDynamoDB } from "database/dynamodb";

import { IResponse } from "interfaces/api-gateway";

const handler = async (event: APIGatewayEvent): Promise<IResponse> => {
  try {
    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");

    let neural_requests_id = event.pathParameters.neural_requests_id;

    const neural_requests_condition = "neural_requests_id = :param";
    const neural_requests_parameters = {
      ":param": neural_requests_id,
    };
    const neural_requests = await database.getRecord(
      "neural_requests",
      "neural_requests_id",
      neural_requests_condition,
      neural_requests_parameters
    );

    return Responses._200({
      statusCode: 200,
      message: STRINGS.TEXTS.NEURAL_GROUP_REQUESTS,
      data: neural_requests,
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
