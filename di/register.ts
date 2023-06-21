import { DynamoDBRepository } from 'libs/database';
import { DynamoDB } from 'libs/database-query';
import { container } from 'tsyringe';

container.registerSingleton('DynamoDBRepository', DynamoDBRepository);
container.registerSingleton('DynamoDB', DynamoDB);

export default container;
