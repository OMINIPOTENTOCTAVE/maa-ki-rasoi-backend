const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./modules/auth/auth.routes");
const menuRoutes = require("./modules/menu/menu.routes");
const orderRoutes = require("./modules/order/order.routes");
const subscriptionRoutes = require("./modules/subscription/subscription.routes");
const deliveryRoutes = require("./modules/delivery/delivery.routes");
const analyticsRoutes = require("./modules/analytics/analytics.routes");
const complaintRoutes = require("./modules/complaint/complaint.routes");

const app = express();

// Security and Hardening
app.use(helmet());

// CORS: Support multiple frontend origins (comma-separated in CORS_ORIGIN)
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : null;

app.use(cors({
  origin: allowedOrigins || "*",
  credentials: true
}));
app.use(express.json({ limit: "1mb" })); // Prevent large payload attacks
app.use(cookieParser());

// Production logging
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// Basic rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, message: "Too many requests from this IP, please try again later." }
});
app.use("/auth", apiLimiter);
app.use("/orders", apiLimiter);
app.use("/delivery/auth", apiLimiter);

const errorHandler = require("./middleware/error");

const paymentRoutes = require("./modules/payment/payment.routes");

app.use("/auth", authRoutes);
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/delivery", deliveryRoutes);
app.use("/payments", paymentRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/complaints", complaintRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.send("Maa Ki Rasoi Backend Running 🚀");
});

app.use(errorHandler);

module.exports = app;
