const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const menuRoutes = require("./modules/menu/menu.routes");
const authRoutes = require("./modules/auth/auth.routes");
const orderRoutes = require("./modules/orders/orders.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Maa Ki Rasoi API is healthy" });
});

app.use("/api/auth/admin", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

module.exports = app;
