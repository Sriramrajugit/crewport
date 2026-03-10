const express = require('express');
const {
  getCrewMembers, getCrewMember, createCrewMember, updateCrewMember, deleteCrewMember
} = require('../controllers/crewController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getCrewMembers);
router.get('/:id', getCrewMember);
router.post('/', authorize('admin'), createCrewMember);
router.put('/:id', updateCrewMember);
router.delete('/:id', authorize('admin'), deleteCrewMember);

module.exports = router;
