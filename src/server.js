require("dotenv").config();
const app = require("./app");
const prisma = require("./prisma");


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

let isShuttingDown = false;

const shutdown = async (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  app.set('isShuttingDown', true);

  console.log(`[${signal}] Shutdown signal received. Draining connections...`);

  server.close(async () => {
    console.log('HTTP server closed. No new connections accepted.');
    try {
      await prisma.$disconnect();
      console.log('Database pool closed cleanly.');
      console.log('Graceful shutdown complete.');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown cleanup:', err);
      process.exit(1);
    }
  });

  // Cloud Run hard kill is 10s. Force exit at 8s to guarantee clean logs.
  setTimeout(() => {
    console.error('Shutdown timeout exceeded. Forcing exit.');
    process.exit(1);
  }, 8000);
};

process.on("SIGINT", () => shutdown('SIGINT'));
process.on("SIGTERM", () => shutdown('SIGTERM'));

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  shutdown('unhandledRejection');
});
