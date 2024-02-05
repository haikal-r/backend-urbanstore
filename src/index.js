const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(express.json())

app.get("/api", (req, res) => {
  res.send("Selamat datang di api akh anjaay");
});

const productController = require("./product/product.controller")

app.use("/products", productController)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Express API running in port: " + PORT);
});
