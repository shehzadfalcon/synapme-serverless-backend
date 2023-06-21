export default {
  "get-post": {
    handler: "src/lambdas/index.getPostHandler",
    events: [
      {
        http: {
          path: "/posts/{post_id}",
          method: "get",
          cors: true,
          bodyType: "GetPostRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Posting"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Success",
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
  "get-all-post": {
    handler: "src/lambdas/index.getAllPostHandler",
    events: [
      {
        http: {
          path: "/posts/get-all-post",
          method: "post",
          cors: true,
          bodyType: "GetAllPostRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Posting"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Success",
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

  "get-post-by-author": {
    handler: "src/lambdas/index.getPostByAuthorHandler",
    events: [
      {
        http: {
          path: "/post-by-author-id/{author_id}",
          method: "post",
          cors: true,
          bodyType: "GetPostsByAuthorRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Posting"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Success",
              bodyType: "Response",
            },
            500: {
              description: "Internal server error",
              bodyType: "ErrorResponse",
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
  "create-post": {
    handler: "src/lambdas/index.createPostHandler",
    events: [
      {
        http: {
          path: "/post",
          method: "post",
          cors: true,
          bodyType: "CreatePostRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Posting"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Success",
              bodyType: "Response",
            },
            500: {
              description: "Internal server error",
              bodyType: "ErrorResponse",
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
  "get-comment": {
    handler: "src/lambdas/index.getCommentHandler",
    events: [
      {
        http: {
          path: "/comments/{comment_id}",
          method: "get",
          cors: true,
          bodyType: "GetCommentRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Posting"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Success",
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
  "get-comments-by-post-id": {
    handler: "src/lambdas/index.getCommentsByPostIdHandler",
    events: [
      {
        http: {
          path: "/comments-by-post-id/{post_id}",
          method: "post",
          cors: true,
          bodyType: "GetCommentsByPostRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Posting"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Success",
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
  "create-comment": {
    handler: "src/lambdas/index.createCommentHandler",
    events: [
      {
        http: {
          path: "/comments",
          method: "post",
          cors: true,
          bodyType: "CreateCommentRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Posting"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Success",
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
  "up-vote-post": {
    handler: "src/lambdas/index.upVotePostHandler",
    events: [
      {
        http: {
          path: "/up-vote-post",
          method: "post",
          cors: true,
          bodyType: "UpVotePostRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Upvoting"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Success",
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
  "up-vote-shared-post": {
    handler: "src/lambdas/index.upVoteSharedPostHandler",
    events: [
      {
        http: {
          path: "/up-vote-shared-post",
          method: "post",
          cors: true,
          bodyType: "UpVoteSharedPostRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Upvoting"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Success",
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
  "up-vote-comment": {
    handler: "src/lambdas/index.upVoteCommentHandler",
    events: [
      {
        http: {
          path: "/up-vote-comment",
          method: "post",
          cors: true,
          bodyType: "UpVoteCommentRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Upvoting"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Success",
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
  "get-shared-posts-by-author": {
    handler: "src/lambdas/index.getSharedPostsByAuthorHandler",
    events: [
      {
        http: {
          path: "/get-shared-post/{author_id}",
          method: "post",
          cors: true,
          bodyType: "GetSharedPostByAuthorRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Sharing"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Success",
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
  "create-share-post": {
    handler: "src/lambdas/index.createSharePostHandler",
    events: [
      {
        http: {
          path: "/create-share-post",
          method: "post",
          cors: true,
          bodyType: "SharePostRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Sharing"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Success",
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
