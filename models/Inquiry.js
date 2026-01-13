import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    companyName: String,
    contactName: String,
    email: String,
    country: String,
    phone: String,
    inquiryType: String,
    quantity: String,
    customization: String,
    message: String,
  },
  { timestamps: true }
);

export default mongoose.models.Inquiry ||
  mongoose.model("Inquiry", InquirySchema);
