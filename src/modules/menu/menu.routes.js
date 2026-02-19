const express = require("express");
const router = express.Router();

// Temporary dummy data (we will replace with DB later)
const menuItems = [
  {
    id: 1,
    name: "Veg Thali",
    description: "Dal, Sabzi, 4 Roti, Rice",
    price: 120
  },
  {
    id: 2,
    name: "Paneer Thali",
    description: "Paneer Sabzi, Dal, 4 Roti, Rice",
    price: 160
  },
  {
    id: 3,
    name: "Student Special",
    description: "Dal, Rice, Pickle",
    price: 80
  }
];

// GET all menu items
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: menuItems
  });
});

module.exports = router;
