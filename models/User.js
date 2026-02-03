import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, "Company name is required"],
    trim: true,
  },
  contactName: {
    type: String,
    required: [true, "Contact person name is required"],
    trim: true,
  },
  businessEmail: {
    type: String,
    required: [true, "Business email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  country: {
    type: String,
    required: [true, "Country is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
  },
  businessType: {
    type: String,
    required: [true, "Business type is required"],
  },
  purpose: {
    type: String,
    required: [true, "Purpose is required"],
  },
  verificationProof: {
    type: String,
    required: [true, "Verification proof type is required"],
  },
  verificationImage: {
    type: String, // Cloudflare R2 URL
  },
  password: {
    type: String,
  },
  
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

  approvedAt: {
    type: Date,
  },
  rejectedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted created date
UserSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Index for faster queries
UserSchema.index({ status: 1 });
UserSchema.index({ createdAt: -1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);