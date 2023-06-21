import { Responses } from "utils/serverless-responses";
import { APIGatewayEvent } from "aws-lambda";
import STRINGS from "utils/texts";
import diRegistry from "di/register";
import { IDynamoDB } from "database/dynamodb";

import { IResponse } from "interfaces/api-gateway";

const handler = async (event: APIGatewayEvent): Promise<IResponse> => {
  try {
    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");

    let neural_id = event.pathParameters.neural_id;
    const condition = "neural_id = :param";
    const parameters = {
      ":param": neural_id,
    };
    const isExist: any = await database.getRecord(
      "neural",
      "neural_id",
      condition,
      parameters
    );

    if (isExist.length <= 0) {
      return Responses._400({
        statusCode: 404,
        message: STRINGS.ERRORS.NEURAL_GROUP_NOT_EXISTS,
        success: false,
      });
    }
    const neural_requests_condition = "neural_id = :param";
    const neural_requests_parameters = {
      ":param": neural_id,
    };
    const neural_requests = await database.getRecord(
      "neural_requests",
      "neural_id",
      neural_requests_condition,
      neural_requests_parameters
    );
    // let user = await getAllRecord("neural_requests");
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
