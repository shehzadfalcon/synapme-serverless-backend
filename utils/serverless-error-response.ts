export const ErrorResponses = {
  _400(message = '', data = []) {
    return {
      error: true,
      message,
      data,
    };
  },
};
