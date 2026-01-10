// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  companyName: String,
  contactName: String,
  email: { type: String, unique: true },
  password: String,

  phone: String,
  country: String,
  businessType: String,
  purpose: String,
  verificationProof: String,

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
