const express = require("express");
const cors = require("cors");

const menuRoutes = require("./modules/menu/menu.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/menu", menuRoutes);

app.get("/", (req, res) => {
  res.send("Maa Ki Rasoi Backend Running 🚀");
});

module.exports = app;
