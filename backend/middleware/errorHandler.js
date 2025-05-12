const { logEvent } = require("./logger");

const errorHandler = (err, req, res) => {
  logEvent(`${req.name}\t${req.method}\t${req.message}`, "errLog.log");
  console.log(err.stack);

  const status = res.statusCode ? res.statusCode : 500; // server error

  res.status(status);
  res.json({ message: err.message });
};

module.exports = errorHandler;
