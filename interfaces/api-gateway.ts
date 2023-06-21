export interface IResponse {
  headers: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Method': string;
  };
  statusCode: number;
  body: string;
}
