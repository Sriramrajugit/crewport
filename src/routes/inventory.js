const express = require('express');
const {
  getInventoryItems, getInventoryItem, createInventoryItem, updateInventoryItem, deleteInventoryItem
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getInventoryItems);
router.get('/:id', getInventoryItem);
router.post('/', authorize('admin'), createInventoryItem);
router.put('/:id', authorize('admin'), updateInventoryItem);
router.delete('/:id', authorize('admin'), deleteInventoryItem);

module.exports = router;
