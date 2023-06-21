export const ValidationResponses = {
  validate(schema, data) {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      return {
        error: true,
        data: error.details.map((item) => {
          return {
            name: item.context.key,
            message: item.message,
          };
        }),
      };
    }
    return {
      error: false,
      data: [],
    };
  },
};
