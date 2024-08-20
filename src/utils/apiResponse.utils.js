const { StatusCodes } = require("http-status-codes");

const errorCustomMessage = (errors) =>
  errors.details.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.path]: curr.message,
    }),
    {}
  );

module.exports = {
  apiResponse: (code, status, message, data) => {
    const result = {};
    result.code = code;
    result.status = status;
    result.message = message;
    result.data = data;

    return result;
  },
  apiResponseValidationError: (errors) => {
    const result = {};
    result.code = StatusCodes.UNPROCESSABLE_ENTITY;
    result.status = "UNPROCESSABLE_ENTITTY";
    result.message = "The given data was invalid";
    result.errors = errorCustomMessage(errors);

    return result;
  },
  notFoundResponse: (message) => {
    const result = {};
    result.code = StatusCodes.NOT_FOUND;
    result.code = "NOT_FOUND";
    result.message = `${
      message ? `${message} Not Found` : "Resource Not Found"
    }`;

    return result;
  },
  unAuthorizedResponse: (message) => {
    const result = {};
    result.code = StatusCodes.UNAUTHORIZED;
    result.status = "UNAUTHORIZED";
    result.message = `Unauthorized.${message ? `${message}` : ""}`;

    return result;
  },
  noContentResponse: (message) => {
    const result = {};
    result.code = StatusCodes.NO_CONTENT;
    result.status = "NO_CONTENT";
    result.message = message;

    return result;
  },
  badRequestResponse: (message) => {
    const result = {};
    result.code = StatusCodes.BAD_REQUEST;
    result.status = "BAD_REQUEST";
    result.message = message;

    return result;
  },
};
