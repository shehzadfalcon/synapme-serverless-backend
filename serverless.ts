import "reflect-metadata";
import config from "./serverless-config";
import postDefinition from "./src/lambdas/posts/post-api-definition";
import "reflect-metadata";
import type { AWS } from "@serverless/typescript";
import { databaseResources } from "./resources/database";
import authenticationDefinition from "./src/lambdas/user/auth-api-definition";
import notificationDefinition from "./src/lambdas/notifications/notificaton-api-definition";
import friendRequestDefinition from "./src/lambdas/request/request-api-definition";
import neuralApiDefinition from "./src/lambdas/neural/neural-api-defination";
import neuralRequestsApiDefinition from "./src/lambdas/neural-requests/neural-requests-api-defination";
import debateRequestsApiDefinition from "./src/lambdas/debate/debate-api-defination";

const serverlessConfiguration: AWS = {
  service: "Synapme-API-Documentation",
  frameworkVersion: "3",
  useDotenv: true,
  plugins: [
    "serverless-esbuild",
    "serverless-auto-swagger",
    "serverless-webpack",
    "serverless-dynamodb-local",
    "serverless-dotenv-plugin",
    "serverless-offline",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    profile: config.profile,
    stage: config.stage,
    region: config.region,

    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },

    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },

    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:*", "ses:*", "sns:*", "lambda:*"],
        Resource: "*",
      },
    ],
  },

  functions: {
    authAuthorizer: {
      handler: "src/lambdas/index.authorizerHandler",
    },
    ...authenticationDefinition,
    ...notificationDefinition,
    ...postDefinition,
    ...neuralApiDefinition,
    ...neuralRequestsApiDefinition,
    ...friendRequestDefinition,
    ...debateRequestsApiDefinition,
  },
  resources: {
    Resources: {
      ...databaseResources,
    },
  },
  package: { individually: true },
  custom: {
    autoswagger: {
      basePath: "/dev",
      useStage: false,
      apiType: "http",
      schemes: ["http", "https"],
      apiKeyHeaders: ["Authorization"],
      typefiles: ["./swagger-documentation/swagger-document-types.d.ts"],
    },

    webpack: {
      webpackConfig: "webpack.config.js",
      packager: "npm",
      concurrency: 5,
      excludeFiles: "/**/*.test.js",
      includeModules: [
        {
          forceExclude: ["aws-sdk"],
        },
      ],
    },

    dynamodb: {
      stages: ["dev"],
      start: {
        port: 4000,
        dbPath: "dev-db-memory/",
        inMemory: false,
        migrate: true,
      },

      migration: {
        dir: "offline/migrations",
      },
    },
  },
};

module.exports = serverlessConfiguration;
