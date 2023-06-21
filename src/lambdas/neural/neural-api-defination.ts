export default {
  "create-neural": {
    handler: "src/lambdas/index.createNeuralHandler",
    events: [
      {
        http: {
          path: "/neural/create",
          method: "post",
          cors: true,
          bodyType: "CreateNeuralRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Neural Group"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Successfully created an neural",
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
