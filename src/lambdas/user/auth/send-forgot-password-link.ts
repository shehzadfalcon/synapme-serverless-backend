import moment from 'moment';
import sendEmail from 'services/send-email';
import { Responses } from 'utils/serverless-responses';
import { ValidationResponses } from 'utils/validation-reponse';
import { ErrorResponses } from 'utils/serverless-error-response';
import forgotPasswordLinkSchema from '../validation-schema/send-forgot-password-link-schema';
import { IResponse } from 'interfaces/api-gateway';
import { APIGatewayEvent } from 'aws-lambda';
import diRegistry from 'di/register';
import { IDynamoDB } from 'database/dynamodb';

const custom_errors = [
  'Request body is empty',
  'Missing fields is required',
  'Account not found',
  'Password reset link sent successfully',
  'Account is not verified',
  'Invalid request payload',
  'Internal server error',
];

const handler = async (event: APIGatewayEvent): Promise<IResponse> => {
  try {
    const body = JSON.parse(event.body);

    if (!body || JSON.stringify(body) === '{}') {
      throw ErrorResponses._400(`${custom_errors[0]}`);
    }

    const isValid = ValidationResponses.validate(
      forgotPasswordLinkSchema,
      body
    );

    if (isValid.error) {
      throw ErrorResponses._400('Invalid request payload', isValid.data);
    }

    const all_fields = Object.keys(body);
    const required_fields = ['email'];

    const missing_fields = required_fields.filter(
      (field) => !all_fields.includes(field)
    );

    if (missing_fields.length > 0) {
      throw ErrorResponses._400(`${custom_errors[1]}`, missing_fields);
    }

    const { email } = body;
    const database: IDynamoDB = diRegistry.resolve('DynamoDBRepository');

    const condition = 'email = :param';
    const parameters = {
      ':param': email.toLowerCase(),
    };

    const user = await database.getRecord(
      'users',
      'user_email',
      condition,
      parameters
    );

    if (user.Items.length === 0) {
      throw ErrorResponses._400(custom_errors[2]);
    }

    const { first_name, user_id, verified } = user.Items[0];

    if (!verified) {
      throw ErrorResponses._400(custom_errors[4]);
    }

    const date = moment().toISOString();
    const token = Math.random().toString(36).substr(2, 8);

    const updateCondition = {
      user_id,
    };
    const updateParameters = {
      ':token': token,
      ':date': date,
    };
    const update = 'set reset_password_code = :token, updated_at = :date';
    await database.updateRecord(
      'user_tokens',
      updateCondition,
      update,
      updateParameters
    );

    const email_info = {
      user_email: email,
      user_first_name: first_name,
      subject: 'Forgot password code',
      message: token,
      type: 'forgot-password-link',
    };

    await sendEmail(email_info);
    return Responses._200({
      statusCode: 200,
      message: custom_errors[3],
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