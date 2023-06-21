import { inject, injectable } from 'tsyringe';
import { IDynamoDB } from 'database/dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { BatchGetCommandOutput, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import {
  QueryCommandOutput,
  DeleteCommandOutput,
  UpdateCommandOutput,
  ScanCommandOutput,
  PutCommandOutput,
} from "@aws-sdk/lib-dynamodb";

// database options
let options = {
  convertEmptyValues: true,
};

if (process.env.IS_OFFLINE) {
  options["region"] = "localhost";
  options["endpoint"] = "http://localhost:4000";
}

const client = new DynamoDBClient(options);
export const dynamodb = DynamoDBDocumentClient.from(client);

@injectable()
export class DynamoDBRepository implements IDynamoDB {
  constructor(@inject("DynamoDB") private db: IDynamoDB) {}
  deleteRecord(
    tableName: string,
    condition: { [key: string]: any }
  ): Promise<DeleteCommandOutput> {
    return this.db.deleteRecord(tableName, condition);
  }
  updateRecord(
    tableName: string,
    conditionExpression: { [key: string]: any },
    updateExpression: string,
    parameter: any,
    indexTableName: string,
    conditionAttributeNames: string
  ): Promise<UpdateCommandOutput> {
    return this.db.updateRecord(
      tableName,
      conditionExpression,
      updateExpression,
      parameter,
      indexTableName,
      conditionAttributeNames
    );
  }
  getRecord(
    tableName: string,
    indexTableName: string,
    conditionExpression: any,
    parameter: { [key: string]: any },
    limit: number,
    ExclusiveStartKey: { [key: string]: string },
    select?: string,
    selectAttributes?: string
  ): Promise<QueryCommandOutput> {
    return this.db.getRecord(
      tableName,
      indexTableName,
      conditionExpression,
      parameter,
      limit,
      ExclusiveStartKey,
      select,
      selectAttributes
    );
  }

  async insert(
    tableName: string,
    data: { [key: string]: any }
  ): Promise<PutCommandOutput | void> {
    await this.db.insert(tableName, data);
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
    return await this.db.getRecordWithFilter(
      tableName,
      indexTableName,
      expressionAttributeNames,
      filter,
      selectedAttribute,
      parameter,
      limit,
      ExclusiveStartKey
    );
  }

  async getBatchItems(params: {
    [key: string]: { Keys: any }
  }): Promise<BatchGetCommandOutput> {
    return await this.db.getBatchItems(
      params
    );
  }
}
