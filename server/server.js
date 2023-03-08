require("dotenv").config();
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const { logger, stream } = require("./utils/winston");
const { swaggerUI, specs } = require("./utils/swagger");

const { COOKIE_SECRET } = process.env;

const app = express();

// router
const router = require("./routes");

app.use(bodyParser.json());
app.use("/", router);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(
  express.urlencoded({
    limit: "50mb",
    extended: false,
    parameterLimit: 1000000,
  })
);
app.use(cors());
app.use(helmet());
app.use(fileUpload());
app.use(morgan("short", { stream }));
app.use(cookieParser(COOKIE_SECRET));
app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  logger.error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  logger.error(err);

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});

module.exports = app;
