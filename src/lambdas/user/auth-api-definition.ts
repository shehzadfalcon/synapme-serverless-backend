export default {
  "create-user": {
    handler: "src/lambdas/index.createUserHandler",
    events: [
      {
        http: {
          path: "/user/create-account",
          method: "post",
          cors: true,
          bodyType: "CreateAccountRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Authentication"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Successfully created an account",
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

  "user-login": {
    handler: "src/lambdas/index.loginHandler",
    events: [
      {
        http: {
          path: "/user/login",
          method: "post",
          cors: true,
          bodyType: "LoginAccountRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Authentication"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Login successfully",
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

  "verify-account": {
    handler: "src/lambdas/index.verifyAccountHandler",
    events: [
      {
        http: {
          path: "/user/verify-account",
          method: "post",
          cors: true,
          bodyType: "VerifyAccountRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Authentication"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Account verified successfully",
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
  "forgot-password-link": {
    handler: "src/lambdas/index.sendForgotPasswordLinkHandler",
    events: [
      {
        http: {
          path: "/user/forgot-password-link",
          method: "post",
          cors: true,
          bodyType: "ForgotPasswordLinkRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Authentication"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Forgot password link sent successfully",
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
  "forgot-password": {
    handler: "src/lambdas/index.forgotPasswordHandler",
    events: [
      {
        http: {
          path: "/user/forgot-password",
          method: "post",
          cors: true,
          bodyType: "ForgotPasswordRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Authentication"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Password changed successfully",
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
  //update profile image
  "update-profile-image": {
    handler: "src/lambdas/index.getUpdateUserPhotoHandler",
    events: [
      {
        http: {
          path: "/user/update-profile-image/{id}",
          method: "patch",
          cors: true,
          bodyType: "UpdateProfileImageRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Authentication"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Profile Image updated successfully",
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
  "get-user": {
    handler: "src/lambdas/index.getOneUserHandler",
    events: [
      {
        http: {
          path: "/user/{id}",
          method: "get",
          cors: true,
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Authentication"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "User fetched successfully",
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
  //get authorize user
  "get-authorize-user": {
    handler: "src/lambdas/index.getAuthorizeUserHandler",
    events: [
      {
        http: {
          path: "/user",
          method: "get",
          cors: true,
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Authentication"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "User fetched successfully",
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
  //update profile
  "update-user-profile": {
    handler: "src/lambdas/index.updateUserHandler",
    events: [
      {
        http: {
          path: "/user/update-account/{id}",
          method: "patch",
          cors: true,
          bodyType: "UpdateAccountRequestBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Authentication"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Account updated successfully",
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
  //upvote profile
  "upvote-user-profile": {
    handler: "src/lambdas/index.upvoteUserProfileHandler",
    events: [
      {
        http: {
          path: "/user/upvote-account/{user_id}",
          method: "post",
          cors: true,
          bodyType: "UpvoteUserRequestsBody",
          consumes: ["application/json"],
          produces: ["application/json"],
          swaggerTags: ["Authentication"],
          responseData: {
            400: {
              description: "Bad Request",
              bodyType: "ErrorResponse",
            },
            200: {
              description: "Account updated successfully",
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
