import mongoose from 'mongoose';

const WishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
}, { 
  timestamps: true 
});

// Index for faster queries
WishlistSchema.index({ user: 1, product: 1 }, { unique: true });
WishlistSchema.index({ user: 1 });
WishlistSchema.index({ product: 1 });

export default mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);
