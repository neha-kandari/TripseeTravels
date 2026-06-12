import mongoose, { Document, Schema } from 'mongoose';

export interface IItinerary extends Document {
  title: string;
  destination: string;
  duration: string;
  overview: string;
  packageId?: string;
  hotelName?: string;
  hotelRating?: string;
  hotelDescription?: string;
  hotelImages?: {
    src: string;
    alt: string;
    name: string;
    description: string;
  }[];
  days: {
    day: number;
    title: string;
    activities: string[];
    meals: string[];
    accommodation: string;
  }[];
  inclusions: string[];
  exclusions: string[];
  category?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ItinerarySchema = new Schema<IItinerary>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  overview: {
    type: String,
    required: true,
    trim: true
  },
  packageId: {
    type: String,
    trim: true
  },
  hotelName: {
    type: String,
    trim: true
  },
  hotelRating: {
    type: String,
    trim: true
  },
  hotelDescription: {
    type: String,
    trim: true
  },
  hotelImages: [{
    src: String,
    alt: String,
    name: String,
    description: String
  }],
  days: [{
    day: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    activities: [{
      type: String,
      trim: true
    }],
    meals: [{
      type: String,
      trim: true
    }],
    accommodation: {
      type: String,
      required: true,
      trim: true
    }
  }],
  inclusions: [{
    type: String,
    trim: true
  }],
  exclusions: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes for better performance
ItinerarySchema.index({ destination: 1 });
ItinerarySchema.index({ packageId: 1 });
ItinerarySchema.index({ category: 1 });
ItinerarySchema.index({ isActive: 1 });

const Itinerary = (mongoose.models.Itinerary as mongoose.Model<IItinerary>) || mongoose.model<IItinerary>('Itinerary', ItinerarySchema);
export default Itinerary;
