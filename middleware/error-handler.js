const errorHandler = (error, req, res, next) => {
  let capturedError = {
    statusCode: error.statusCode ? error.statusCode : 500,
    message: error.message ? error.message : "Server Error",
  };

  res.status(capturedError.statusCode).json({
    success: false,
    error: capturedError.message,
  });
};

module.exports = errorHandler;
