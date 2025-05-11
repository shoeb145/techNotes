const express = require("express");
const app = express();
const PORT = process.env.PORT || 3500;
const path = require("path");

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root.js"));

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
app.listen(PORT, () => console.log(`listening on  ${PORT} `));
