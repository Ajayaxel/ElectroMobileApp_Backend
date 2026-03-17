const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', productController.getProducts);
router.post('/', protect, admin, productController.createProduct);
router.put('/:id', protect, admin, productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;
