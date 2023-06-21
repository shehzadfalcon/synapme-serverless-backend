import { APIGatewayEvent } from 'aws-lambda';
import { Responses } from 'utils/serverless-responses';
import { ErrorResponses } from 'utils/serverless-error-response';
import { IResponse } from 'interfaces/api-gateway';
import getAllNotificationSchema from '../validation-schema/get-all-notifications-schema';
import { ValidationResponses } from 'utils/validation-reponse';
import diRegistry from 'di/register';
import { IDynamoDB } from 'database/dynamodb';

const custom_errors = [
  'Request body is empty',
  'Missing fields is required',
  'Successfully subscribed to notification',
  'Updated subscribed service',
  'Invalid request payload',
  'Internal server error',
];

const handler = async (event: APIGatewayEvent): Promise<IResponse> => {
  try {
    const body = event.pathParameters;

    if (!body || JSON.stringify(body) === '{}') {
      throw ErrorResponses._400(`${custom_errors[0]}`);
    }

    const isValid = ValidationResponses.validate(
      getAllNotificationSchema,
      body
    );

    if (isValid.error) {
      throw ErrorResponses._400('Invalid request payload', isValid.data);
    }

    const all_fields = Object.keys(body);
    const required_fields = ['user_id'];

    const missing_fields = required_fields.filter(
      (field) => !all_fields.includes(field)
    );

    if (missing_fields.length > 0) {
      throw ErrorResponses._400(`${custom_errors[1]}`, missing_fields);
    }

    const { user_id } = body;

    const expressAttributeNames = {
      '#notification_status': 'status',
    };
    const filter = 'contains(receivers_id , :param)';
    const parameters = {
      ':param': user_id,
    };

    const database: IDynamoDB = diRegistry.resolve('DynamoDBRepository');

    const notifications = await database.getRecordWithFilter(
      'notifications',
      '',
      expressAttributeNames,
      filter,
      'created_at,id,title,sender_id,content,#notification_status',
      parameters
    );

    return Responses._200({
      statusCode: 200,
      message: custom_errors[2],
      data: notifications.Items,
    });
  } catch (error) {
    if (error?.type === 'notification') {
      return Responses._400({
        statusCode: 400,
        message: error?.message,
        data: [],
      });
    }
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
