require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3500;
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler.js");
const corsOption = require("./config/corsOption.js");
const { logger, logEvent } = require("./middleware/logger.js");
const mongoose = require("mongoose");
const connectDB = require("./config/dbCon.js");

connectDB();
app.use(cookieParser());
app.use(cors(corsOption));
app.use(logger);
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root.js"));
app.use("/users", require("./routes/userRoutes.js"));
app.use("/notes", require("./routes/noteRoutes.js"));
app.all("*w", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404!.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 not found" });
  } else {
    req.type("txt").send("404! not found");
  }
});
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connected to mongodb");
  app.listen(PORT, () => console.log(`listening on  ${PORT} `));
});

mongoose.connection.on("error", (err) => {
  logEvent(
    `${err.no}: ${err.code}: ${err.syscall}: ${err.hostname}`,
    "mongoErrLog`"
  );
});
