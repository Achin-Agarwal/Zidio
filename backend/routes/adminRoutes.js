import express from "express";
import ExcelRecord from "../models/ExcelRecord.js";
import User from "../models/User.js";
import checkAuth from "../middlewares/auth.js";
import { safeHandler } from "../middlewares/safeHandler.js";

const router = express.Router();

router.get(
  "/audit",
  safeHandler(async (req, res) => {
    try {
      const recordsGroupedByUser = await ExcelRecord.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "uploadedBy",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $group: {
            _id: "$uploadedBy",
            user: { $first: "$user" },
            records: {
              $push: {
                _id: "$_id",
                data: "$data",
                uploadedAt: "$uploadedAt",
                fileName: "$fileName", // ✅ Added this line
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            user: {
              _id: "$user._id",
              name: "$user.name",
              email: "$user.email",
            },
            records: 1,
          },
        },
      ]);

      res.json(recordsGroupedByUser);
    } catch (err) {
      console.error("Error fetching grouped records:", err);
      res.status(500).json({ error: err.message });
    }
  })
);

router.post(
  "/delete/:id",
  safeHandler(async (req, res) => {
    const record = await User.findById(req.params.id);
    if (!record) {
      throw new ApiError(404, "User not found", "USER_NOT_FOUND");
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  })
);
export default router;
