const express = require("express");
const dotenv = require("dotenv");
const { routes } = require("./routes");
const { StatusCodes: status } = require("http-status-codes")
const { apiResponse } = require('./utils/apiResponse.utils')
const cookieParser = require("cookie-parser");
const cors = require("cors")

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors())
app.use(cookieParser())


app.get('/', (req, res) => {
  res.status(status.OK).json(
    apiResponse(status.OK, 'OK', 'Welcome to the initial Express API Structure')
  )
})

app.get((req, res) => {
  res.status(status.NOT_FOUND).json(
    apiResponse(status.NOT_FOUND, 'NOT_FOUND', 'The requested resource could not be found.')
  )
})

app.get((err, req, res, next) => {
  res.status(status.INTERNAL_SERVER_ERROR).json(
    apiResponse(status.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR', err.message)
  )
})

// Routes
routes(app);

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}, ${process.env.BASE_URL}` );
});
