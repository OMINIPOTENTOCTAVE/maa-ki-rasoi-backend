const { z } = require("zod");

const updateOrderStatusSchema = z.object({
  status: z.enum(["Pending", "Confirmed", "Preparing", "Delivered"])
});

module.exports = { updateOrderStatusSchema };
