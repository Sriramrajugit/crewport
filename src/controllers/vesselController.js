const Vessel = require('../models/Vessel');

const getVessels = async (req, res) => {
  try {
    const vessels = await Vessel.find().populate('managedBy', 'name email');
    res.status(200).json({ success: true, data: vessels });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getVessel = async (req, res) => {
  try {
    const vessel = await Vessel.findById(req.params.id).populate('managedBy', 'name email');
    if (!vessel) {
      return res.status(404).json({ success: false, message: 'Vessel not found' });
    }
    res.status(200).json({ success: true, data: vessel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createVessel = async (req, res) => {
  try {
    if (!req.body.managedBy) {
      req.body.managedBy = req.user._id;
    }
    const vessel = await Vessel.create(req.body);
    res.status(201).json({ success: true, data: vessel });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Vessel with this IMO number already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateVessel = async (req, res) => {
  try {
    const vessel = await Vessel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('managedBy', 'name email');

    if (!vessel) {
      return res.status(404).json({ success: false, message: 'Vessel not found' });
    }

    res.status(200).json({ success: true, data: vessel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteVessel = async (req, res) => {
  try {
    const vessel = await Vessel.findById(req.params.id);
    if (!vessel) {
      return res.status(404).json({ success: false, message: 'Vessel not found' });
    }

    await vessel.deleteOne();

    res.status(200).json({ success: true, message: 'Vessel deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getVessels, getVessel, createVessel, updateVessel, deleteVessel };
