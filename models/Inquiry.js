import mongoose from "mongoose";

// Schema for cart inquiry products
const CartProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  selectedSizes: [{
    type: String,
    default: 'Standard'
  }]
});

const InquirySchema = new mongoose.Schema(
  {
    // User reference (for logged-in users)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    
    // Inquiry type
    inquiryType: {
      type: String,
      enum: ['single_product', 'cart_inquiry', 'bulk', 'custom', 'private', 'corporate', 'other'],
      default: 'cart_inquiry'
    },
    
    // For single product inquiries (legacy support)
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false
    },
    
    // For cart-based inquiries (new)
    cartProducts: [CartProductSchema],
    
    // Cart inquiry specific fields
    totalProducts: {
      type: Number,
      default: 0
    },
    totalQuantity: {
      type: Number,
      default: 0
    },
    
    // Inquiry details
    inquiryFor: {
      type: String,
      enum: ['bulk_order', 'wholesale', 'custom_design', 'private_label', 'corporate_project', 'other'],
      required: true
    },
    estimatedQuantity: {
      type: String,
      enum: ['50-100', '100-500', '500-1000', '1000+', 'to_be_discussed'],
      required: true
    },
    customizationNeeded: {
      type: String,
      enum: ['finish_color', 'material', 'packaging', 'branding_logo', 'none'],
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    
    // Legacy fields (for backward compatibility)
    companyName: String,
    contactName: String,
    email: String,
    country: String,
    phone: String,
    quantity: String,
    customization: String,
    sizes: [String],
    
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
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual to populate user details
InquirySchema.virtual('userDetails', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true
});

// Index for better performance
InquirySchema.index({ user: 1, createdAt: -1 });
InquirySchema.index({ status: 1, createdAt: -1 });
InquirySchema.index({ inquiryType: 1, createdAt: -1 });

export default mongoose.models.Inquiry ||
  mongoose.model("Inquiry", InquirySchema);
