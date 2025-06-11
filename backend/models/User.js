import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: String,
    avatarUrl: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    lastLogin: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
