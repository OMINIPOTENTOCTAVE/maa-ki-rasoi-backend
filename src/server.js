require("dotenv").config();
const app = require("./app");
const { validateEnv } = require("./config/env");

validateEnv();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
