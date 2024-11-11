exports.globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (process.env.MODE == "PROD"){
    return res.status(err.statusCode).json({ error: err.message });
  }
  
  res.status(err.statusCode).json({ error: err.message, stack: err.stack });
};
