const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDb = require("./config/db");

const authRoutes = require("./routes/authRoutes");

//rest object
const app = express();

//dotenv
dotenv.config();

//mongo connection
connectDb();

//middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.DEV_MODE} on port ${PORT}`.bgCyan.white
  );
});
