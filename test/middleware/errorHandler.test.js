const errorHandler = require('../../middleware/errorHandler');
const listError = {
    validation_error: 400,
    unauthorized: 401,
    forbidden: 403,
    not_found: 404,
    internal_server_error: 500,
};
describe('errorHandler middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      statusCode: 200,
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should handle validation error', () => {
    const err = new Error('Validation error');
    res.statusCode = listError.validation_error;

    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      title: 'Validation failure!',
      message: 'Validation error',
      stackTrace: err.stack,
    });
  });

  test('should handle unauthorized error', () => {
    const err = new Error('Unauthorized');
    res.statusCode = listError.unauthorized;

    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      title: 'Unauthorized',
      message: 'Unauthorized',
      stackTrace: err.stack,
    });
  });

  // Add more test cases for other error types...

  test('should handle internal server error', () => {
    const err = new Error('Internal server error');
    res.statusCode = listError.internal_server_error;

    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      title: 'Server error',
      message: 'Internal server error',
      stackTrace: err.stack,
    });
  });

  test('should handle unknown error', () => {
    const err = new Error('Unknown error');

    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      title: 'An internal server error happened!',
      message: 'Unknown error',
      stackTrace: err.stack,
    });
  });
});