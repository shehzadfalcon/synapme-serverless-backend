import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

let options = {
  region: 'us-east-1',
};

if (process.env.IS_OFFLINE) {
  options['region'] = 'localhost';
  options['endpoint'] = 'http://localhost:3002';
}

const client = new LambdaClient(options);

export const invokeLambda = async (
  functionName: string,
  payload: string | any
): Promise<void> => {
  try {
    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: Buffer.from(payload),
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
    });

    await client.send(command);
  } catch (error) {
    throw {
      type: 'Lambda function invocation',
      error: true,
      message: 'Function failed',
    };
  }
};
