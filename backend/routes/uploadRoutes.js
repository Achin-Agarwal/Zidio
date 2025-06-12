import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import ExcelRecord from '../models/ExcelRecord.js';
import checkAuth from '../middlewares/auth.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/upload', checkAuth, upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const record = await ExcelRecord.create({
      fileName: req.file.originalname,
      uploadedBy: req.user._id,
      originalFilePath: req.file.path,
      jsonData,
    });

    res.status(201).json({ message: 'File uploaded and processed', record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my-files', checkAuth, async (req, res) => {
  try {
    const records = await ExcelRecord.find({ uploadedBy: req.user._id });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/download/:id', checkAuth, async (req, res) => {
  try {
    const record = await ExcelRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ error: 'File not found' });
    if (req.user.role !== 'admin' && record.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    res.download(path.resolve(record.originalFilePath));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;