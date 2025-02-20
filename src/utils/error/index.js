export const asyncHandeler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      next(error);
    });
  };
};

export const globalHandelerror = (err, req, res, next) => {
  return res.status(err["cause"] || 500).json({
    message: err.message,
    stack: err.stack,
  });
};
