export default {
  'notification-trigger': {
    handler: 'src/lambdas/index.notificationTriggerHandler',
    events: [
      {
        http: {
          path: '/notification-trigger',
          method: 'post',
          cors: true,
          bodyType: 'NotificationBodyRequest',
          consumes: ['application/json'],
          produces: ['application/json'],
          swaggerTags: ['Notification'],
          responseData: {
            400: {
              description: 'Bad Request',
              bodyType: 'ErrorResponse',
            },
            200: {
              description: 'Successfully created an account',
              bodyType: 'Response',
            },
            500: {
              description: 'Internal server error',
              bodyType: 'ErrorResponse',
            },
          },
          authorizer: {
            name: 'authAuthorizer',
            type: 'request',
            identitySource: 'method.request.header.Authorization',
          },
        },
      },
    ],
  },

  subscribe: {
    handler: 'src/lambdas/index.notificationSubscriptionHandler',
    events: [
      {
        http: {
          path: '/subscribe',
          method: 'post',
          cors: true,
          bodyType: 'SubscribeBodyRequest',
          consumes: ['application/json'],
          produces: ['application/json'],
          swaggerTags: ['Notification'],
          authorizer: {
            name: 'authAuthorizer',
            type: 'request',
            identitySource: 'method.request.header.Authorization',
          },
          responseData: {
            400: {
              description: 'Bad Request',
              bodyType: 'ErrorResponse',
            },
            200: {
              description: 'Successfully subscribed to notifications',
              bodyType: 'Response',
            },
            500: {
              description: 'Internal server error',
              bodyType: 'ErrorResponse',
            },
          },
        },
      },
    ],
  },

  'get-all-notification': {
    handler: 'src/lambdas/index.getAllNotificationsHandler',
    events: [
      {
        http: {
          path: '/notifications/{user_id}',
          method: 'get',
          cors: true,
          consumes: ['application/json'],
          produces: ['application/json'],
          swaggerTags: ['Notification'],
          queryStringParameters: {
            user_id: {
              required: true,
              type: 'string',
              description: 'user id',
            },
          },
          authorizer: {
            name: 'authAuthorizer',
            type: 'request',
            identitySource: 'method.request.header.Authorization',
          },
          responseData: {
            400: {
              description: 'Bad Request',
              bodyType: 'ErrorResponse',
            },
            200: {
              description: 'Successfully fetch user notifications',
              bodyType: 'Response',
            },
            500: {
              description: 'Internal server error',
              bodyType: 'ErrorResponse',
            },
          },
        },
      },
    ],
  },
};
