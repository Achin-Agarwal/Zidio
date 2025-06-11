import express from "express";
import { safeHandler } from "../middlewares/safeHandler.js";
import { userBaseSchema } from "../validators/auth-validators.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post(
  "/create",
  safeHandler(async (req, res) => {
    const parsed = userBaseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ errors: parsed.error.flatten().fieldErrors });
    }

    const { name, email, password, role } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      lastLogin: new Date(),
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  })
);

router.get(
  "/all",
  safeHandler(async (req, res) => {
    const users = await User.find({}, "-password");
    res.status(200).json({ users });
  })
);

export default router;
