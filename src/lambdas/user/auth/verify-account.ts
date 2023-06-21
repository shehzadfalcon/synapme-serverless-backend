import moment from 'moment';
import { Responses } from 'utils/serverless-responses';
import { ValidationResponses } from 'utils/validation-reponse';
import { ErrorResponses } from 'utils/serverless-error-response';
import verifyAccountSchema from '../validation-schema/verify-account-schema';
import { APIGatewayEvent } from 'aws-lambda';
import diRegistry from 'di/register';
import { IResponse } from 'interfaces/api-gateway';
import { IDynamoDB } from 'database/dynamodb';

const custom_errors = [
  'Request body is empty',
  'Missing fields is required',
  'Account not found',
  'Invalid verification token',
  'Account verified successfully',
  'Account already verified',
  'Invalid request payload',
  'Internal server error',
];

const handler = async (event: APIGatewayEvent): Promise<IResponse> => {
  try {
    const body = JSON.parse(event.body);

    if (!body || JSON.stringify(body) === '{}') {
      throw ErrorResponses._400(`${custom_errors[0]}`);
    }

    const isValid = ValidationResponses.validate(verifyAccountSchema, body);

    if (isValid.error) {
      throw ErrorResponses._400('Invalid request payload', isValid.data);
    }

    const all_fields = Object.keys(body);
    const required_fields = ['verificationCode', 'email'];

    const missing_fields = required_fields.filter(
      (field) => !all_fields.includes(field)
    );

    if (missing_fields.length > 0) {
      throw ErrorResponses._400(`${custom_errors[1]}`, missing_fields);
    }

    const { verificationCode: code, email } = body;
    const database: IDynamoDB = diRegistry.resolve('DynamoDBRepository');

    const existUserCondition = 'email = :param';
    const existUserParameters = {
      ':param': email.toLowerCase(),
    };

    const user = await database.getRecord(
      'users',
      'user_email',
      existUserCondition,
      existUserParameters
    );

    if (user.Items.length === 0) {
      throw ErrorResponses._400(custom_errors[2]);
    }

    if (user.Items[0].verified) {
      throw ErrorResponses._400(custom_errors[5]);
    }

    const condition = 'verification_code = :param';
    const parameters = {
      ':param': code,
    };

    const verificationCode = await database.getRecord(
      'user_tokens',
      'verification',
      condition,
      parameters
    );

    if (
      verificationCode.Items.length === 0 ||
      verificationCode.Items[0].verification_code !== code
    ) {
      throw ErrorResponses._400(custom_errors[3]);
    }

    const date = moment().toISOString();

    const updateCondition = {
      user_id: user.Items[0].user_id,
    };
    const updateParameters = {
      ':verified': true,
      ':date': date,
    };
    const update = 'set verified = :verified, updated_at = :date';
    await database.updateRecord(
      'users',
      updateCondition,
      update,
      updateParameters
    );

    return Responses._200({
      statusCode: 200,
      message: custom_errors[4],
      data: [],
    });
  } catch (error) {
    console.log(error)
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