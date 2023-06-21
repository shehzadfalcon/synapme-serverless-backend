import { jwt_util } from "../../utils/jwt";
import diRegistry from "di/register";
import { Callback, Context } from "aws-lambda";
import { IDynamoDB } from "database/dynamodb";

const handler = async (event: any, _context: Context, callback: Callback) => {
  try {
    if (!event.headers.Authorization) {
      return generatePolicy("token", "Denied", event.methodArn);
    }

    // const token = event.headers.Authorization.split(" ")[1];
    // add below line because i am getting token in Authorization key
    const token = event.headers.Authorization;

    if (!token) {
      return generatePolicy("token", "Denied", event.methodArn);
    }

    const verified_id = await jwt_util.verify(token);
    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");

    const condition = "user_id = :param";
    const parameters = {
      ":param": verified_id,
    };

    const user: any = await database.getRecord(
      "user_tokens",
      "",
      condition,
      parameters
    );

    if (user.Items.length === 0) {
      return generatePolicy("token", "Denied", event.methodArn);
    }

    return callback(
      null,
      generatePolicy("token", "Allow", event.methodArn, verified_id)
    );
  } catch (error) {
    console.log(error, "error");
    return callback("User is not authorized to access this resourcess");
  }
};

const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string,
  payload: string = ""
) => {
  const authResponse = {
    context: {
      user_id: payload,
    },
  };

  authResponse["principalId"] = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument["Version"] = "2012-10-17";
    policyDocument["Statement"] = [];
    const statementOne = {};
    statementOne["Action"] = "execute-api:Invoke";
    statementOne["Effect"] = effect;
    statementOne["Resource"] = resource;
    policyDocument["Statement"][0] = statementOne;
    authResponse["policyDocument"] = policyDocument;
  }
  return authResponse;
};

export default handler;
