const express = require('express');
const {
  createOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder
} = require('../controllers/orderController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(protect, createOrder)
  .get(protect, authorize('admin'), getAllOrders);

router.route('/me')
  .get(protect, myOrders);

router.route('/:id')
  .get(protect, getSingleOrder)
  .put(protect, authorize('admin'), updateOrder)
  .delete(protect, authorize('admin'), deleteOrder);

module.exports = router;
