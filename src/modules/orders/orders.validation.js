const { z } = require("zod");

const orderSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().min(10).max(20),
  address: z.string().min(8).max(500),
  paymentMethod: z.literal("COD"),
  items: z.array(z.object({ menuItemId: z.string().uuid(), quantity: z.number().int().min(1).max(20) })).min(1)
});

module.exports = { orderSchema };
