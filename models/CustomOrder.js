import mongoose from "mongoose";

const CustomOrderSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: "",
    },

    contactPersonName: {
      type: String,
      default: "",
    },

    businessEmail: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    inquiryType: {
      type: String,
      default: "",
    },

    productCategory: {
      type: String,
      default: "",
    },

    customizationRequired: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      default: "",
    },

    referenceFiles: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.CustomOrder ||
  mongoose.model("CustomOrder", CustomOrderSchema);
