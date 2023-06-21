import { uuid } from "uuidv4";
import moment from "moment";
import bcrypt from "bcryptjs";
import { Responses } from "utils/serverless-responses";
import { ErrorResponses } from "utils/serverless-error-response";
import { ValidationResponses } from "utils/validation-reponse";
import sendEmail from "services/send-email";
import createAccountSchema from "../validation-schema/register-schema";
import { APIGatewayEvent } from "aws-lambda";
import { IResponse } from "interfaces/api-gateway";
import { IDynamoDB } from "database/dynamodb";
import diRegistry from "di/register";

const custom_errors = [
  "Request body is empty",
  "Missing fields is required",
  "User already exist",
  "Account created successfully",
  "Invalid request payload",
  "Internal server error",
];

const passwordHash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
};

const handler = async (event: APIGatewayEvent): Promise<IResponse> => {
  try {
    const body = JSON.parse(event.body);

    if (!body || JSON.stringify(body) === "{}") {
      throw ErrorResponses._400(`${custom_errors[0]}`);
    }

    const isValid = ValidationResponses.validate(createAccountSchema, body);

    if (isValid.error) {
      throw ErrorResponses._400("Invalid request payload", isValid.data);
    }

    const all_fields = Object.keys(body);
    const required_fields = [
      "email",
      "userName",
      "firstName",
      "lastName",
      "dataOfBirth",
      "gender",
      "background",
      "profileImageUrl",
      "password",
    ];

    const missing_fields: any = required_fields.filter(
      (field) => !all_fields.includes(field)
    );

    if (missing_fields.length > 0) {
      throw ErrorResponses._400(`${custom_errors[1]}`, missing_fields);
    }

    const {
      email,
      userName: user_name,
      firstName: first_name,
      lastName: last_name,
      dataOfBirth: date_of_birth,
      gender,
      background,
      password,
      profileImageUrl: profile_image_url,
    } = body;

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

    if (alreadyExist.Items.length > 0) {
      throw ErrorResponses._400(`${custom_errors[2]}`);
    }

    const id = uuid();
    const password_hashed = await passwordHash(password);
    const verification_code = Math.random().toString(36).substr(2, 8);
    const date = moment().toISOString();
    const email_info = {
      user_email: email,
      user_first_name: first_name,
      subject: "Email Verification",
      message: verification_code,
      type: "signup",
    };

    const user_record = {
      user_id: id,
      email,
      user_name,
      first_name,
      last_name,
      date_of_birth: date_of_birth,
      gender,
      background,
      profile_image_url,
    };

    await database.insert("users", {
      ...user_record,
      password: password_hashed,
      created_at: date,
      updated_at: date,
      verified: false,
      totalVotes: 0,
    });

    await database.insert("user_tokens", {
      user_id: id,
      verification_code,
      created_at: date,
      updated_at: date,
    });

    await sendEmail(email_info);

    return Responses._200({
      statusCode: 200,
      message: custom_errors[3],
      data: [{ user_id: id, email }],
    });
  } catch (error) {
    if (custom_errors.includes(error.message)) {
      return Responses._400(error);
    }

    throw Responses._500({
      statusCode: 500,
      message: custom_errors[5],
      data: [],
    });
  }
};

export default handler;
