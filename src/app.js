const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.routes");
const menuRoutes = require("./modules/menu/menu.routes");
const orderRoutes = require("./modules/order/order.routes");

const app = express();

app.use(cors());
app.use(express.json());

const errorHandler = require("./middleware/error");

app.use("/auth", authRoutes);
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Maa Ki Rasoi Backend Running 🚀");
});

app.use(errorHandler);

module.exports = app;
