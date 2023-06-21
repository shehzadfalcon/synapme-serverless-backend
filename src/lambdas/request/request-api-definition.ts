export default {
  'send-friend-request': {
    handler: 'src/lambdas/index.sendFriendRequestHandler',
    events: [
      {
        http: {
          path: '/send/friend-request',
          method: 'post',
          cors: true,
          bodyType: 'FriendRequestBodyRequest',
          consumes: ['application/json'],
          produces: ['application/json'],
          swaggerTags: ['Request'],
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
};
