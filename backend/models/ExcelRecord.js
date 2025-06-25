import mongoose from "mongoose";

const excelRecordSchema = new mongoose.Schema({
  data: {
    type: Array,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  fileName: {
    type: String,
    required: true,
  },
});


const ExcelRecord = mongoose.model('ExcelRecord', excelRecordSchema);

export default ExcelRecord;
