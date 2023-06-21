import {
  QueryCommandOutput,
  DeleteCommandOutput,
  UpdateCommandOutput,
  ScanCommandOutput,
  PutCommandOutput,
  BatchGetCommandOutput,
} from "@aws-sdk/lib-dynamodb";

export interface IDynamoDB {
  insert(
    tableName: string,
    data: { [key: string]: any }
  ): Promise<PutCommandOutput | void>;

  getRecord(
    tableName: string,
    indexTableName: string,
    conditionExpression: any,
    parameter: { [key: string]: any },
    limit?: number,
    ExclusiveStartKey?: { [key: string]: any },
    select?: string,
    selectAttributes?: string
  ): Promise<QueryCommandOutput>;

  deleteRecord(
    tableName: string,
    condition: { [key: string]: any }
  ): Promise<DeleteCommandOutput>;

  getRecordWithFilter(
    tableName: string,
    indexTableName: string,
    expressionAttributeNames: { [key: string]: any } | string,
    filter: string,
    selectedAttribute: string,
    parameter: { [key: string]: any },
    limit?: number,
    ExclusiveStartKey?: { [key: string]: any }
  ): Promise<ScanCommandOutput>;

  updateRecord(
    tableName: string,
    conditionExpression: { [key: string]: any },
    updateExpression: string,
    parameter,
    indexTableName?: string,
    conditionAttributeNames?: { [key: string]: any } | string
  ): Promise<UpdateCommandOutput>;

  getBatchItems(requestParams: {
    [key: string]: { Keys: any };
  }): Promise<BatchGetCommandOutput>;
}
