const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const { DB_URL } =
  process.env.NODE_ENV === "production" ? process.env : require("./config");
const bodyParser = require("body-parser");
const apiRouter = require("./routers/api");
const { handle400s, handle404s, handle500s } = require("./errors");

app.use(cors());
mongoose.connect(DB_URL).then(() => {});

//process.end.NODE_ENV === "production" ? process.env :

app.use(bodyParser.json());

app.get("/", (req, res, next) => {
  res.sendFile(`${__dirname}/views/api.html`);
});

app.use("/api", apiRouter);

app.get("/", (req, res, next) => {
  res.sendFile(`${__dirname} views/api.html`);
});

app.get("/*", (req, res, next) => {
  res.status(404).send({ msg: "Page not found" });
});

app.use(handle400s);
app.use(handle404s);
app.use(handle500s);
module.exports = app;
