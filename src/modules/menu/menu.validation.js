const { z } = require("zod");

const menuItemSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(2).max(500),
  price: z.number().positive(),
  category: z.string().min(2).max(80),
  isAvailable: z.boolean().optional()
});

const menuItemUpdateSchema = menuItemSchema.partial();

module.exports = { menuItemSchema, menuItemUpdateSchema };
