import mongoose from "mongoose";

const excelRecordSchema = new mongoose.Schema({
    data : {
        type: Array,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const ExcelRecord = mongoose.model("ExcelRecord", excelRecordSchema);