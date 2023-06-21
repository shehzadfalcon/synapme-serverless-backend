import { dynamodb } from "./database";
import {
  PutCommand,
  ScanCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommandOutput,
  DeleteCommandOutput,
  UpdateCommandOutput,
  ScanCommandOutput,
  PutCommandOutput,
  BatchGetCommandOutput,
  BatchGetCommand,
} from "@aws-sdk/lib-dynamodb";
import { IDynamoDB } from "database/dynamodb";

const custom_message = ["Database failed", "failed to insert data"];

const errorResponse = async (response) => {
  if (response["$metadata"]?.httpStatusCode !== 200) {
    throw {
      isError: true,
      status: response["$metadata"]?.httpStatusCode,
      error: custom_message[1],
    };
  }
};

export class DynamoDB implements IDynamoDB {
  async deleteRecord(
    tableName: string,
    condition: { [key: string]: any }
  ): Promise<DeleteCommandOutput> {
    try {
      let params = {
        Key: condition,
        TableName: tableName,
      };

      const response = await dynamodb.send(new DeleteCommand(params));
      await errorResponse(response);
      return response;
    } catch (error) {
      throw {
        isError: true,
        error,
      };
    }
  }
  async updateRecord(
    tableName: string,
    conditionExpression: { [key: string]: any },
    updateExpression: string,
    parameter: any,
    indexTableName: string,
    conditionAttributeNames: string
  ): Promise<UpdateCommandOutput> {
    try {
      const params = {
        Key: conditionExpression,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: parameter,
        TableName: tableName,
        ReturnValues: "UPDATED_NEW",
      };

      if (indexTableName) {
        params["IndexName"] = indexTableName;
      }

      if (conditionAttributeNames) {
        params["ExpressionAttributeNames"] = conditionAttributeNames;
      }

      const response = await dynamodb.send(new UpdateCommand(params));
      await errorResponse(response);
      return response;
    } catch (error) {
      throw {
        isError: true,
        error,
      };
    }
  }

  async getRecord(
    tableName: string,
    indexTableName: string,
    conditionExpression: any,
    parameter: { [key: string]: any },
    limit: number,
    ExclusiveStartKey: { [key: string]: string },
    select?: string,
    selectAttributes?: string
  ): Promise<QueryCommandOutput> {
    try {
      let params = {
        KeyConditionExpression: conditionExpression,
        ExpressionAttributeValues: parameter,
        TableName: tableName,
      };

      if (limit) {
        params["Limit"] = limit;
      }

      if (ExclusiveStartKey) {
        params["ExclusiveStartKey"] = ExclusiveStartKey;
      }

      if (indexTableName) {
        params["IndexName"] = indexTableName;
      }
      if (select == "SPECIFIC_ATTRIBUTES") {
        params["select"] = select;
        params["ProjectionExpression"] = selectAttributes;
      }
      const response = await dynamodb.send(new QueryCommand(params));
      await errorResponse(response);
      return response;
    } catch (error) {
      throw {
        isError: true,
        error,
      };
    }
  }

  async insert(
    tableName: string,
    data: { [key: string]: any }
  ): Promise<PutCommandOutput | void> {
    try {
      const params = {
        TableName: tableName,
        Item: data,
      };
      const command = new PutCommand(params);

      const response = await dynamodb.send(command);

      await errorResponse(response);
    } catch (error) {
      if (error.status) {
        throw {
          isError: true,
          error: error,
        };
      }

      throw {
        isError: true,
        error: custom_message[0],
      };
    }
  }

  async getRecordWithFilter(
    tableName: string,
    indexTableName: string,
    expressionAttributeNames: string | { [key: string]: any },
    filter: string,
    selectedAttribute: string,
    parameter: { [key: string]: any },
    limit: number,
    ExclusiveStartKey: { [key: string]: string }
  ): Promise<ScanCommandOutput> {
    try {
      let params = {
        TableName: tableName,
      };

      if(parameter){
        params["ExpressionAttributeValues"] = parameter;
      }

      if(filter){
        params["FilterExpression"] = filter;
      }

      if (limit) {
        params["Limit"] = limit;
      }

      if (ExclusiveStartKey) {
        params["ExclusiveStartKey"] = ExclusiveStartKey;
      }

      if (expressionAttributeNames) {
        params["ExpressionAttributeNames"] = expressionAttributeNames;
      }

      if (selectedAttribute) {
        params["ProjectionExpression"] = selectedAttribute;
      }

      if (indexTableName) {
        params["IndexName"] = indexTableName;
      }

      const response = await dynamodb.send(new ScanCommand(params));
      await errorResponse(response);
      return response;
    } catch (error) {
      throw {
        isError: true,
        error,
      };
    }
  }

  async getBatchItems(requestParams: {
    [key: string]: { Keys: any }
  }): Promise<BatchGetCommandOutput> {
    try {
      const params = {
        RequestItems: requestParams,
      };

      const response = await dynamodb.send(new BatchGetCommand(params));
      return response;
    } catch (error) {
      throw {
        isError: true,
        error,
      };
    }
  }
}
