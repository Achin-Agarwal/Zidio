import express from "express";
import ExcelRecord from "../models/ExcelRecord.js";
import checkAuth from "../middlewares/auth.js";
import checkRole from "../middlewares/checkRole.js";
import { safeHandler } from "../middlewares/safeHandler.js";

const router = express.Router();

router.get(
  "/au",
  checkAuth("admin"),
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

export default router;
