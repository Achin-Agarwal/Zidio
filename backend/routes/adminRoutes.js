import express from 'express';
import ExcelRecord from '../models/ExcelRecord.js';
import checkAuth from '../middlewares/auth.js';
import checkRole from '../middlewares/checkRole.js';

const router = express.Router();

// Admin route to get all uploads
router.get('/all-uploads', checkAuth, checkRole('admin'), async (req, res) => {
  try {
    const records = await ExcelRecord.find().populate('uploadedBy', 'name email');
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;