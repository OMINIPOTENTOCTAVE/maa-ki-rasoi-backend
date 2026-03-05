require("dotenv").config();
const app = require("./app");
const prisma = require("./prisma");

const { initOrderCron } = require("./modules/order/order.generator");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);

  // Initialize Daily Automation (V4.0 - Generates physical dispatch records at 10:30 PM IST)
  initOrderCron();
});

// Handle graceful shutdown
const gracefulShutdown = async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  gracefulShutdown();
});
