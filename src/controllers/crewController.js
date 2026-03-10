const CrewMember = require('../models/CrewMember');

const getCrewMembers = async (req, res) => {
  try {
    const query = {};

    if (req.query.vessel) query.vessel = req.query.vessel;
    if (req.query.status) query.status = req.query.status;

    // Crew members can only see their own record
    if (req.user.role === 'crew') {
      query.user = req.user._id;
    }

    const crewMembers = await CrewMember.find(query)
      .populate('user', 'name email role')
      .populate('vessel', 'name imoNumber');

    res.status(200).json({ success: true, data: crewMembers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getCrewMember = async (req, res) => {
  try {
    const crewMember = await CrewMember.findById(req.params.id)
      .populate('user', 'name email role')
      .populate('vessel', 'name imoNumber');

    if (!crewMember) {
      return res.status(404).json({ success: false, message: 'Crew member not found' });
    }

    res.status(200).json({ success: true, data: crewMember });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createCrewMember = async (req, res) => {
  try {
    const crewMember = await CrewMember.create(req.body);
    const populated = await crewMember.populate('user', 'name email role');

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Crew member with this user or passport already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateCrewMember = async (req, res) => {
  try {
    const crewMember = await CrewMember.findById(req.params.id);
    if (!crewMember) {
      return res.status(404).json({ success: false, message: 'Crew member not found' });
    }

    // Crew can only update their own record
    if (req.user.role === 'crew' && crewMember.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this crew member' });
    }

    const updated = await CrewMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('user', 'name email role')
      .populate('vessel', 'name imoNumber');

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteCrewMember = async (req, res) => {
  try {
    const crewMember = await CrewMember.findById(req.params.id);
    if (!crewMember) {
      return res.status(404).json({ success: false, message: 'Crew member not found' });
    }

    await crewMember.deleteOne();

    res.status(200).json({ success: true, message: 'Crew member deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCrewMembers, getCrewMember, createCrewMember, updateCrewMember, deleteCrewMember };
