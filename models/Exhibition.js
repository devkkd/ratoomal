import mongoose from "mongoose";

const ExhibitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  tagline: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  longDescription: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  openingHours: {
    type: String,
    default: "10:00 AM - 6:00 PM"
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  mainImage: {
    type: String,
    required: true
  },
  galleryImages: [{
    type: String
  }],
  category: {
    type: String,
    enum: ['Art', 'Sculpture', 'Handicrafts', 'Antiques', 'Cultural', 'Religious', 'Contemporary'],
    default: 'Art'
  },
  featured: {
    type: Boolean,
    default: false
  },
  isUpcoming: {
    type: Boolean,
    default: true
  },
  curator: {
    name: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      trim: true
    },
    image: {
      type: String
    }
  },
  artists: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      default: 'Artist'
    }
  }],
  ticketPrice: {
    type: String,
    default: 'Free'
  },
  duration: {
    type: String
  },
  expectedVisitors: {
    type: String
  },
  highlights: [{
    type: String,
    trim: true
  }],
  about: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Add virtual for computed fields
ExhibitionSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.startDate <= now && this.endDate >= now;
});

ExhibitionSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  if (this.endDate < now) return 0;
  return Math.ceil((this.endDate - now) / (1000 * 60 * 60 * 24));
});

export default mongoose.models.Exhibition || mongoose.model("Exhibition", ExhibitionSchema);