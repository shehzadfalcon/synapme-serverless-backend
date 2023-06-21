export const databaseResources = {
  userDatabase: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "users",
      AttributeDefinitions: [
        {
          AttributeName: "user_id",
          AttributeType: "S",
        },
        {
          AttributeName: "email",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "user_id",
          KeyType: "HASH",
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "user_email",
          KeySchema: [
            {
              AttributeName: "email",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
        {
          IndexName: "user_id",
          KeySchema: [
            {
              AttributeName: "user_id",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
      ],

      BillingMode: "PAY_PER_REQUEST",
    },
  },

  tokenDatabase: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "user_tokens",
      AttributeDefinitions: [
        {
          AttributeName: "user_id",
          AttributeType: "S",
        },
        {
          AttributeName: "verification_code",
          AttributeType: "S",
        },
        {
          AttributeName: "reset_password_code",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "user_id",
          KeyType: "HASH",
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "verification",
          KeySchema: [
            {
              AttributeName: "verification_code",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
        {
          IndexName: "reset_password",
          KeySchema: [
            {
              AttributeName: "reset_password_code",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
      ],

      BillingMode: "PAY_PER_REQUEST",
    },
  },

  notificationSubscriptionsDatabase: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "notification_subscriptions",
      AttributeDefinitions: [
        {
          AttributeName: "endpoint",
          AttributeType: "S",
        },
        {
          AttributeName: "user_id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "endpoint",
          KeyType: "HASH",
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "userID",
          KeySchema: [
            {
              AttributeName: "user_id",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
      ],

      BillingMode: "PAY_PER_REQUEST",
    },
  },

  notifications: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "notifications",
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
        {
          AttributeName: "sender_id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "senderID",
          KeySchema: [
            {
              AttributeName: "sender_id",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },

        // {
        //   IndexName: 'receiversID',
        //   KeySchema: [
        //     {
        //       AttributeName: 'receivers_id',
        //       KeyType: 'HASH',
        //     },
        //   ],
        //   Projection: {
        //     ProjectionType: 'ALL',
        //   },
        // },
      ],

      BillingMode: "PAY_PER_REQUEST",
    },
  },
  friendRequestDatabase: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "friend_requests",
      AttributeDefinitions: [
        {
          AttributeName: "user_id",
          AttributeType: "S",
        },
        {
          AttributeName: "request_id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "user_id",
          KeyType: "HASH",
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "requestID",
          KeySchema: [
            {
              AttributeName: "request_id",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
      ],

      BillingMode: "PAY_PER_REQUEST",
    },
  },
  //neural group schema
  neuralDatabase: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "neural",
      AttributeDefinitions: [
        {
          AttributeName: "neural_id",
          AttributeType: "S",
        },
        {
          AttributeName: "leader_id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "neural_id",
          KeyType: "HASH",
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "leader_id",
          KeySchema: [
            {
              AttributeName: "leader_id",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
        {
          IndexName: "neural_id",
          KeySchema: [
            {
              AttributeName: "neural_id",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    },
  },
  //neural request schema
  neuralRequestsDatabase: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "neural_requests",
      AttributeDefinitions: [
        {
          AttributeName: "neural_requests_id",
          AttributeType: "S",
        },
        {
          AttributeName: "neural_id",
          AttributeType: "S",
        },

        {
          AttributeName: "user_id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "neural_requests_id",
          KeyType: "HASH",
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "neural_requests_id",
          KeySchema: [
            {
              AttributeName: "neural_requests_id",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
        {
          IndexName: "user_id",
          KeySchema: [
            {
              AttributeName: "user_id",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
        {
          IndexName: "neural_id",
          KeySchema: [
            {
              AttributeName: "neural_id",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
      ],

      BillingMode: "PAY_PER_REQUEST",
    },
  },
  postDatabase: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "posts",
      AttributeDefinitions: [
        {
          AttributeName: "post_id",
          AttributeType: "S",
        },
        {
          AttributeName: "author_id",
          AttributeType: "S",
        },
        {
          AttributeName: "created_at",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "post_id",
          KeyType: "HASH",
        },
        {
          AttributeName: "created_at",
          KeyType: "RANGE",
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "author_id-index",
          KeySchema: [
            {
              AttributeName: "author_id",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    },
  },

  commentDatabase: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "comments",
      AttributeDefinitions: [
        {
          AttributeName: "comment_id",
          AttributeType: "S",
        },
        {
          AttributeName: "post_id",
          AttributeType: "S",
        },
        {
          AttributeName: "author_id",
          AttributeType: "S",
        },
        {
          AttributeName: "created_at",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "comment_id",
          KeyType: "HASH",
        },
        {
          AttributeName: "created_at",
          KeyType: "RANGE",
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "post_id-index",
          KeySchema: [
            {
              AttributeName: "post_id",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
        {
          IndexName: "author_id-index",
          KeySchema: [
            {
              AttributeName: "author_id",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    },
  },

  sharedPostDatabase: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "shared_posts",
      AttributeDefinitions: [
        {
          AttributeName: "shared_post_id",
          AttributeType: "S",
        },
        {
          AttributeName: "post_id",
          AttributeType: "S",
        },
        {
          AttributeName: "author_id",
          AttributeType: "S",
        },
        {
          AttributeName: "created_at",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "shared_post_id",
          KeyType: "HASH",
        },
        {
          AttributeName: "created_at",
          KeyType: "RANGE",
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "post_id-index",
          KeySchema: [
            {
              AttributeName: "post_id",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
        {
          IndexName: "author_id-index",
          KeySchema: [
            {
              AttributeName: "author_id",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    },
  },
  upVotedPostDatabase: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "upvoted_posts",
      AttributeDefinitions: [
        {
          AttributeName: "user_id",
          AttributeType: "S",
        },
        {
          AttributeName: "post_id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "user_id",
          KeyType: "HASH",
        },
        {
          AttributeName: "post_id",
          KeyType: "RANGE",
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    },
  },
  upVotedCommmentsDatabase: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "upvoted_comments",
      AttributeDefinitions: [
        {
          AttributeName: "user_id",
          AttributeType: "S",
        },
        {
          AttributeName: "comment_id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "user_id",
          KeyType: "HASH",
        },
        {
          AttributeName: "comment_id",
          KeyType: "RANGE",
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    },
  },
  //debate schema
  debateDatabase: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "debate",
      AttributeDefinitions: [
        {
          AttributeName: "debate_id",
          AttributeType: "S",
        },
        {
          AttributeName: "challenger_id",
          AttributeType: "S",
        },
        {
          AttributeName: "opponent_id",
          AttributeType: "S",
        },

        {
          AttributeName: "created_at",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "debate_id",
          KeyType: "HASH",
        },
        {
          AttributeName: "created_at",
          KeyType: "RANGE",
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "challenger_id",
          KeySchema: [
            {
              AttributeName: "challenger_id",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
        {
          IndexName: "opponent_id",
          KeySchema: [
            {
              AttributeName: "opponent_id",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    },
  },
  //debate request schema
  debateRequestDatabase: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "debate_requests",
      AttributeDefinitions: [
        {
          AttributeName: "debate_id",
          AttributeType: "S",
        },
        {
          AttributeName: "debate_requests_id",
          AttributeType: "S",
        },
        {
          AttributeName: "user_id",
          AttributeType: "S",
        },

        {
          AttributeName: "created_at",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "debate_requests_id",
          KeyType: "HASH",
        },
        {
          AttributeName: "created_at",
          KeyType: "RANGE",
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "debate_id",
          KeySchema: [
            {
              AttributeName: "debate_id",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
        {
          IndexName: "user_id",
          KeySchema: [
            {
              AttributeName: "user_id",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    },
  },
};
