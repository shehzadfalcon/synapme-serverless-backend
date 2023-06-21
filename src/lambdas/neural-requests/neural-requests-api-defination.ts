export default {
  "create-neural-requests": {
    handler: "src/lambdas/index.createNeuralRequestsHandler",
    events: [
      {
        http: {
          path: "/neural-requests/create",
          method: "post",
          cors: true,
          bodyType: "CreateNeuralRequestsBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Neural Group Requests"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Successfully  neural request sent",
              bodyType: "Response",
            },
            500: {
              description: "Internal server error",
              bodyType: "ErrorResponse",
            },
          },
        },
      },
    ],
  },
  "get-neural-requests_by_neural_id": {
    handler: "src/lambdas/index.getAllNeuralRequestsByNeuralIdHandler",
    events: [
      {
        http: {
          path: "/neural-requests/neurals/{neural_id}",
          method: "get",
          cors: true,
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Neural Group Requests"],
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
        },
      },
    ],
  },
  "get-neural-requests_by_neural_requests_id": {
    handler: "src/lambdas/index.getAllNeuralRequestsHandler",
    events: [
      {
        http: {
          path: "/neural-requests/{neural_requests_id}",
          method: "get",
          cors: true,
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Neural Group Requests"],
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
        },
      },
    ],
  },
  "neural-requests-decision": {
    handler: "src/lambdas/index.decisionNeuralRequestsHandler",
    events: [
      {
        http: {
          path: "/neural-requests/decision",
          method: "post",
          bodyType: "NeuralRequestDecisionRequestBody",
          cors: true,
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Neural Group Requests"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Neural Request updated successfully",
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
