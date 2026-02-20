const requiredVars = ["DATABASE_URL", "JWT_SECRET"];

function validateEnv() {
  const missing = requiredVars.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

module.exports = { validateEnv };
