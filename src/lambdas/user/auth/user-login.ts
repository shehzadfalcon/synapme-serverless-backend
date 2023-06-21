import moment from "moment";
import { jwt_util } from "utils/jwt";
import bcrypt from "bcryptjs";
import { Responses } from "utils/serverless-responses";
import { ValidationResponses } from "utils/validation-reponse";
import { ErrorResponses } from "utils/serverless-error-response";
import loginSchema from "../validation-schema/loging-schema";
import { IResponse } from "interfaces/api-gateway";
import { APIGatewayEvent } from "aws-lambda";
import diRegistry from "di/register";
import { IDynamoDB } from "database/dynamodb";

const custom_errors = [
  "Request body is empty",
  "Missing fields is required",
  "Account does not exist",
  "Successful login",
  "Invalid credentials",
  "Account is not verified",
  "Invalid request payload",
  "Internal server error",
];

const comparePassword = async (password: string, currentPassword: string) => {
  return await bcrypt.compare(currentPassword, password);
};

const handler = async (event: APIGatewayEvent): Promise<IResponse> => {
  try {
    const body = JSON.parse(event.body);

    if (!body || JSON.stringify(body) === "{}") {
      throw ErrorResponses._400(`${custom_errors[0]}`);
    }

    const isValid = ValidationResponses.validate(loginSchema, body);

    if (isValid.error) {
      throw ErrorResponses._400("Invalid request payload", isValid.data);
    }

    const all_fields = Object.keys(body);
    const required_fields = ["email", "password"];

    const missing_fields = required_fields.filter(
      (field) => !all_fields.includes(field)
    );

    if (missing_fields.length > 0) {
      throw ErrorResponses._400(`${custom_errors[1]}`, missing_fields);
    }

    const { email, password: currentPassword } = body;
    const database: IDynamoDB = diRegistry.resolve("DynamoDBRepository");

    const condition = "email = :param";
    const parameters = {
      ":param": email.toLowerCase(),
    };

    const alreadyExist = await database.getRecord(
      "users",
      "user_email",
      condition,
      parameters
    );

    if (alreadyExist.Items.length === 0) {
      throw ErrorResponses._400(custom_errors[2]);
    }

    const { verified, password, user_id } = alreadyExist.Items[0] as {
      [key: string]: any;
    };

    if (!verified) {
      throw ErrorResponses._400(custom_errors[5]);
    }

    const isCorrectPassword = await comparePassword(password, currentPassword);

    if (!isCorrectPassword) {
      throw ErrorResponses._400(custom_errors[4]);
    }

    const date = moment().toISOString();
    const token = await jwt_util.create(user_id);

    const updateCondition = {
      user_id,
    };
    const updateParameters = {
      ":token": token,
      ":date": date,
    };
    const update = "set verification_token = :token, updated_at = :date";
    await database.updateRecord(
      "user_tokens",
      updateCondition,
      update,
      updateParameters
    );

    return Responses._200({
      statusCode: 200,
      message: custom_errors[3],
      data: [{ user_id, email, access_token: token }],
    });
  } catch (error) {
    console.log("error", error);
    if (custom_errors.includes(error.message)) {
      return Responses._400(error);
    }

    throw Responses._500({
      statusCode: 500,
      message: custom_errors[7],
      data: [],
    });
  }
};

export default handler;
