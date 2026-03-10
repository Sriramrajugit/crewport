const express = require('express');
const {
  getVessels, getVessel, createVessel, updateVessel, deleteVessel
} = require('../controllers/vesselController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getVessels);
router.get('/:id', getVessel);
router.post('/', authorize('admin'), createVessel);
router.put('/:id', authorize('admin'), updateVessel);
router.delete('/:id', authorize('admin'), deleteVessel);

module.exports = router;
