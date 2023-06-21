export default {
  "create-debate": {
    handler: "src/lambdas/index.createDebateHandler",
    events: [
      {
        http: {
          path: "/debate/create",
          method: "post",
          cors: true,
          bodyType: "CreateDebateRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Debate Requests"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Successfully created an debate",
              bodyType: "Response",
            },
            500: {
              description: "Internal server error",
              bodyType: "ErrorResponse",
            },
          },
          authorizer: {
            name: "authAuthorizer",
            type: "request",
            identitySource: "method.request.header.Authorization",
          },
        },
      },
    ],
  },
  "get-neural-by-user": {
    handler: "src/lambdas/index.getAllNeuralHandler",
    events: [
      {
        http: {
          path: "/neural/{id}",
          method: "get",
          cors: true,
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Neural Group"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Neurals fetched successfully",
              bodyType: "Response",
            },
            500: {
              description: "Internal server error",
              bodyType: "ErrorResponse",
            },
          },
          authorizer: {
            name: "authAuthorizer",
            type: "request",
            identitySource: "method.request.header.Authorization",
          },
        },
      },
    ],
  },
};
