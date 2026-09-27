const express = require("express");

const {
  createOrder,
  capturePayment,
  getAllOrdersByUserId,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder);

router.post("/capture", capturePayment);

router.get("/list/:userId", getAllOrdersByUserId);

module.exports = router;