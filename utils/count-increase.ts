import { IDynamoDB } from "database/dynamodb";
import diRegistry from "di/register";

const countIncrease = async (
  tableName: string,
  attributeName: string,
  keys: any
) => {

  const updateParameters = { ":incr": 1 }
  const update = `ADD ${attributeName} :incr`;
  const database: IDynamoDB = diRegistry.resolve('DynamoDBRepository');

  await database.updateRecord(
    tableName,
    keys,
    update,
    updateParameters
  );
};

export default countIncrease;