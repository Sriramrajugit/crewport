const InventoryItem = require('../models/InventoryItem');

const getInventoryItems = async (req, res) => {
  try {
    const query = {};

    if (req.query.vessel) query.vessel = req.query.vessel;
    if (req.query.category) query.category = req.query.category;

    let items = await InventoryItem.find(query)
      .populate('vessel', 'name')
      .populate('addedBy', 'name');

    if (req.query.lowStock === 'true') {
      items = items.filter(item => item.isLowStock);
    }

    res.status(200).json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getInventoryItem = async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id)
      .populate('vessel', 'name')
      .populate('addedBy', 'name');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createInventoryItem = async (req, res) => {
  try {
    req.body.addedBy = req.user._id;
    req.body.lastUpdatedBy = req.user._id;

    const item = await InventoryItem.create(req.body);
    const populated = await item.populate('vessel', 'name');

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateInventoryItem = async (req, res) => {
  try {
    req.body.lastUpdatedBy = req.user._id;
    req.body.updatedAt = Date.now();

    const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('vessel', 'name')
      .populate('addedBy', 'name');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteInventoryItem = async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    await item.deleteOne();

    res.status(200).json({ success: true, message: 'Inventory item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getInventoryItems, getInventoryItem, createInventoryItem, updateInventoryItem, deleteInventoryItem };
