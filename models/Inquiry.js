import mongoose from "mongoose";

// Schema for individual inquiry items (for cart-based inquiries)
const InquiryItemSchema = new mongoose.Schema({
  productId: String, // Store product ID as string for flexibility
  productName: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  selectedSizes: [String], // Array of selected sizes
  price: Number,
  image: String,
});

const InquirySchema = new mongoose.Schema(
  {
    // Support both single product (legacy) and multiple products (new cart-based)
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false, // Made optional for cart-based inquiries
    },
    
    // New: Multiple products support for cart-based inquiries
    products: [InquiryItemSchema], // Array of products from cart
    totalItems: Number, // Total number of different products
    
    // User identification
    userDetails: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      companyName: String,
      contactName: String,
      email: String,
      country: String,
      phone: String,
      businessType: String,
      purpose: String,
    },
    
    // Form data (takes priority over user details)
    companyName: String,
    contactName: String,
    email: String,
    country: String,
    phone: String,
    
    // ProductInquiry page fields
    inquiryType: {
      type: String,
      enum: ['bulk', 'custom', 'private', 'corporate', 'other', 'cart_inquiry'],
      default: 'cart_inquiry'
    },
    quantity: String, // Estimated order quantity
    customization: {
      type: String,
      enum: ['finish', 'material', 'packaging', 'branding', 'none'],
    },
    message: String,
    file: String, // File upload reference
    
    // Legacy fields (for backward compatibility)
    sizes: [String], // Legacy: selected sizes for single product
    
    // Status tracking
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'responded', 'closed'],
      default: 'pending',
    },
    
    // Admin notes
    adminNotes: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Index for better query performance
InquirySchema.index({ email: 1, createdAt: -1 });
InquirySchema.index({ 'userDetails.email': 1, createdAt: -1 });
InquirySchema.index({ status: 1, createdAt: -1 });
InquirySchema.index({ inquiryType: 1, createdAt: -1 });

export default mongoose.models.Inquiry ||
  mongoose.model("Inquiry", InquirySchema);
