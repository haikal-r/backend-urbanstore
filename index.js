const express = require("express");
const dotenv = require("dotenv");
const { routes } = require("./src/routes");
const { StatusCodes: status } = require("http-status-codes");
const { apiResponse } = require("./src/utils/apiResponse.utils");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://urbanstore.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Custom-Header"],
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(status.OK).json(
    apiResponse({
      code: status.OK,
      status: "OK",
      message: "Welcome to the initial Express API Structure",
    })
  );
});

app.get((req, res) => {
  res.status(status.NOT_FOUND).json(
    apiResponse({
      code: status.NOT_FOUND,
      status: "NOT_FOUND",
      message: "The requested resource could not be found.",
    })
  );
});

app.get((err, req, res, next) => {
  res.status(status.INTERNAL_SERVER_ERROR).json(
    apiResponse({
      code: status.INTERNAL_SERVER_ERROR,
      status: "INTERNAL_SERVER_ERROR",
      message: err.message,
    })
  );
});

// Routes
routes(app);

// Port
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

module.exports = app