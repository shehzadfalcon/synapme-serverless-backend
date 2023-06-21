import moment from 'moment';
import bcrypt from 'bcryptjs';
import { Responses } from 'utils/serverless-responses';
import { ValidationResponses } from 'utils/validation-reponse';
import { ErrorResponses } from 'utils/serverless-error-response';
import forgotPasswordSchema from '../validation-schema/forgot-password';
import { APIGatewayEvent } from 'aws-lambda';
import diRegistry from 'di/register';
import { IResponse } from 'interfaces/api-gateway';
import { IDynamoDB } from 'database/dynamodb';

const custom_errors = [
  'Request body is empty',
  'Missing fields is required',
  'Invalid code',
  'Account does not exist',
  'Password changed successfully',
  'Invalid request payload',
  'Internal server error',
];

const passwordHash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
};

const handler = async (event: APIGatewayEvent): Promise<IResponse> => {
  try {
    const body = JSON.parse(event.body);

    if (!body || JSON.stringify(body) === '{}') {
      throw ErrorResponses._400(`${custom_errors[0]}`);
    }

    const isValid = ValidationResponses.validate(forgotPasswordSchema, body);

    if (isValid.error) {
      throw ErrorResponses._400('Invalid request payload', isValid.data);
    }

    const all_fields = Object.keys(body);
    const required_fields = ['code', 'password'];

    const missing_fields = required_fields.filter(
      (field) => !all_fields.includes(field)
    );

    if (missing_fields.length > 0) {
      throw ErrorResponses._400(`${custom_errors[1]}`, missing_fields);
    }

    const { code, password } = body;
    const database: IDynamoDB = diRegistry.resolve('DynamoDBRepository');

    const condition = 'reset_password_code = :param';
    const parameters = {
      ':param': code,
    };

    const isValidCode = await database.getRecord(
      'user_tokens',
      'reset_password',
      condition,
      parameters
    );

    if (isValidCode.Items.length === 0) {
      throw ErrorResponses._400(custom_errors[2]);
    }

    const { user_id } = isValidCode[0];

    const userCondition = 'user_id = :param';
    const userParameters = {
      ':param': user_id,
    };

    const user = await database.getRecord(
      'users',
      '',
      userCondition,
      userParameters
    );

    if (user.Items.length === 0) {
      throw ErrorResponses._400(custom_errors[3]);
    }

    const date = moment().toISOString();
    const hashedPassword = await passwordHash(password);

    const updateCondition = {
      user_id,
    };
    const updateParameters = {
      ':password': hashedPassword,
      ':date': date,
    };
    const update = 'set password = :password, updated_at = :date';
    await database.updateRecord(
      'users',
      updateCondition,
      update,
      updateParameters
    );

    const tokenParameters = {
      ':code': ' ',
      ':date': date,
    };

    const tokenUpdate = 'set reset_password_code = :code, updated_at = :date';
    await database.updateRecord(
      'user_tokens',
      updateCondition,
      tokenUpdate,
      tokenParameters
    );

    return Responses._200({
      statusCode: 200,
      message: custom_errors[4],
      data: [],
    });
  } catch (error) {
    if (custom_errors.includes(error.message)) {
      return Responses._400(error);
    }

    throw Responses._500({
      statusCode: 500,
      message: custom_errors[6],
      data: [],
    });
  }
};

export default handler;