export function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);

  res.status(404);

  next(error);
}

export function errorHandler(err, req, res, next) {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  let message = err.message;

  res.status(statusCode).json({
    message,
    stack: err.stack,
  });
}
