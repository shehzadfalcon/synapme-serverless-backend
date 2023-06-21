import { uuid } from 'uuidv4';
import moment from 'moment';
import { APIGatewayEvent } from 'aws-lambda';
import { Responses } from 'utils/serverless-responses';
import { ErrorResponses } from 'utils/serverless-error-response';
import { IResponse } from 'interfaces/api-gateway';
import triggerSchema from '../validation-schema/trigger-schema';
import { ValidationResponses } from 'utils/validation-reponse';
import { sendNotification } from 'services/web-push';
import diRegistry from 'di/register';
import { IDynamoDB } from 'database/dynamodb';

const custom_errors = [
  'Request body is empty',
  'Missing fields is required',
  'Invalid request payload',
  'Notification sent successfully',
  'Internal server error',
];

const handler = async (event: APIGatewayEvent): Promise<IResponse> => {
  try {
    let body = JSON.parse(JSON.stringify(event.body));

    if (!body || JSON.stringify(body) === '{}') {
      throw ErrorResponses._400(`${custom_errors[0]}`);
    }

    body = JSON.parse(body);

    const isValid = ValidationResponses.validate(triggerSchema, body);

    if (isValid.error) {
      throw ErrorResponses._400('Invalid request payload', isValid.data);
    }

    const all_fields = Object.keys(body);
    const required_fields = ['title', 'receiversID', 'payload'];

    const missing_fields = required_fields.filter(
      (field) => !all_fields.includes(field)
    );

    if (missing_fields.length > 0) {
      throw ErrorResponses._400(`${custom_errors[1]}`, missing_fields);
    }

    const { receiversID, title, payload } = body;

    const userID = event.requestContext.authorizer['user_id'];
    const database: IDynamoDB = diRegistry.resolve('DynamoDBRepository');
    const date = moment().toISOString();
    const notification_id = uuid();

    for (let i = 0; i < receiversID.length; i++) {
      const condition = 'user_id = :param';
      const parameters = {
        ':param': receiversID[i],
      };

      const subscription = await database.getRecord(
        'notification_subscriptions',
        'userID',
        condition,
        parameters
      );

      if (subscription.Items.length > 0) {
        const { expirationTime, keys, endpoint } = subscription.Items[0];
        await sendNotification(
          {
            expirationTime,
            keys,
            endpoint: endpoint,
          },
          {
            title: title,
            payload,
          }
        );

        await database.insert('notifications', {
          id: notification_id,
          sender_id: userID,
          receivers_id: receiversID,
          title,
          content: [payload],
          created_at: date,
          updated_at: date,
          status: 'unread',
        });
      }
    }

    return Responses._200({
      statusCode: 200,
      message: custom_errors[3],
      data: [],
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
      message: custom_errors[4],
      data: [],
    });
  }
};

export default handler; 
