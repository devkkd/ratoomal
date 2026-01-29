import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    // Business Details
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    contactPersonName: {
      type: String,
      required: true,
      trim: true
    },
    businessEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    
    // Order & Requirement Details
    inquiryType: {
      type: String,
      enum: ['bulk_order', 'custom_design', 'wholesale', 'private_label', 'corporate_project', 'other'],
      required: true
    },
    productCategory: {
      type: String,
      enum: ['elephant_figurines', 'god_figurines', 'utility_decor', 'animal_figurines', 'all_categories', 'other'],
      required: true
    },
    estimatedQuantity: {
      type: String,
      enum: ['1-50', '51-100', '101-500', '501-1000', '1000+', 'not_sure'],
      required: true
    },
    customizationRequired: {
      type: String,
      enum: ['finish_color', 'material_change', 'size_modification', 'branding_logo', 'packaging', 'none', 'other'],
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    
    // File uploads
    referenceFiles: [{
      filename: String,
      originalName: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    
    // Status tracking
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'responded', 'closed'],
      default: 'pending'
    },
    
    // Admin fields
    adminNotes: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    
    // Source tracking
    source: {
      type: String,
      enum: ['contact_page', 'home_page_bulk_section'],
      default: 'contact_page'
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for better performance
ContactSchema.index({ status: 1, createdAt: -1 });
ContactSchema.index({ inquiryType: 1, createdAt: -1 });
ContactSchema.index({ businessEmail: 1 });

export default mongoose.models.Contact ||
  mongoose.model("Contact", ContactSchema);