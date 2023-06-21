import moment from 'moment';
import { APIGatewayEvent } from 'aws-lambda';
import { Responses } from 'utils/serverless-responses';
import { ErrorResponses } from 'utils/serverless-error-response';
import { IResponse } from 'interfaces/api-gateway';
import subscribeSchema from '../validation-schema/subscribe-schema';
import { ValidationResponses } from 'utils/validation-reponse';
import { sendNotification } from 'services/web-push';
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
    const body = JSON.parse(event.body);

    if (!body || JSON.stringify(body) === '{}') {
      throw ErrorResponses._400(`${custom_errors[0]}`);
    }

    const isValid = ValidationResponses.validate(subscribeSchema, body);

    if (isValid.error) {
      throw ErrorResponses._400('Invalid request payload', isValid.data);
    }

    const all_fields = Object.keys(body);
    const required_fields = ['expirationTime', 'endpoint', 'keys'];

    const missing_fields = required_fields.filter(
      (field) => !all_fields.includes(field)
    );

    if (missing_fields.length > 0) {
      throw ErrorResponses._400(`${custom_errors[1]}`, missing_fields);
    }

    const { endpoint, expirationTime, keys } = body;
    const userID = event.requestContext.authorizer['user_id'];
    const database: IDynamoDB = diRegistry.resolve('DynamoDBRepository');

    const condition = 'user_id = :param';
    const parameters = {
      ':param': userID,
    };
    const alreadySubscribed = await database.getRecord(
      'notification_subscriptions',
      'userID',
      condition,
      parameters
    );

    const date = moment().toISOString();

    if (alreadySubscribed.Items.length > 0) {
      const updateCondition = {
        user_id: userID,
      };
      const updateParameters = {
        ':endpoint': endpoint,
        ':expirationTime': expirationTime,
        ':keys': keys,
        ':date': date,
      };
      const update =
        'set endpoint = :endpoint, updated_at = :date, expirationTime = :expirationTime, #authKey = :keys';
      await database.updateRecord(
        'users',
        updateCondition,
        update,
        updateParameters,
        'userID',
        {
          '#authKey': 'keys',
        }
      );
      return Responses._200({
        statusCode: 200,
        message: custom_errors[3],
        data: [],
      });
    } else {
      await sendNotification(body, {
        title: 'Notification subscription',
        message: 'Successfully subscribed to notification',
      });

      await database.insert('notification_subscriptions', {
        user_id: userID,
        endpoint,
        expirationTime,
        keys,
        created_at: date,
        updated_at: date,
      });

      return Responses._200({
        statusCode: 200,
        message: custom_errors[2],
        data: [],
      });
    }
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