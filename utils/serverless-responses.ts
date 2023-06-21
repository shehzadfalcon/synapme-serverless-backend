import { IResponse } from "interfaces/api-gateway";

const _header = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Method": "*",
};

export const Responses = {
  _200(data = {}): IResponse {
    return {
      headers: _header,
      statusCode: 200,
      body: JSON.stringify(data),
    };
  },

  _400(data = {}): IResponse {
    return {
      headers: _header,
      statusCode: 400,
      body: JSON.stringify(data),
    };
  },

  _500(data = {}): IResponse {
    return {
      headers: _header,
      statusCode: 500,
      body: JSON.stringify(data),
    };
  },
};
