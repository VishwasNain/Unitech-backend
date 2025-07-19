const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productPhotoUpload
} = require('../controllers/productController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Product = require('../models/Product');

router
  .route('/')
  .get(advancedResults(Product, 'user'), getProducts)
  .post(protect, authorize('admin'), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router
  .route('/:id/photo')
  .put(protect, authorize('admin'), productPhotoUpload);

module.exports = router;
