import express from "express";
import { safeHandler } from "../middlewares/safeHandler.js";
import {
  userBaseSchema,
  userLoginSchema,
} from "../validators/auth-validators.js";
import { generateToken } from "../utils/jwtFunct.js";
import ApiError from "../utils/errorClass.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post(
  "/register",
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

router.post(
  "/login",
  safeHandler(async (req, res) => {
    const parsed = userLoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ errors: parsed.error.flatten().fieldErrors });
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(
        404,
        "Invalid email or password",
        "INVALID_CREDENTIALS"
      );
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(
        401,
        "Invalid email or password",
        "INVALID_CREDENTIALS"
      );
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken({ id: user._id, role: user.role });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
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
