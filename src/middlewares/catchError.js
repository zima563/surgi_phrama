const apiError = require("../utils/apiError");

exports.catchError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      next(new apiError(err, 500));
    });
  };
};
