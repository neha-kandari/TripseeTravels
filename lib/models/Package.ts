import mongoose, { Document, Schema } from 'mongoose';

export interface IPackage extends Document {
  name: string;
  description: string;
  price: number;
  duration: string;
  days: string; // Duration in "X Nights Y Days" format for display
  destination: string;
  location: string; // City/location within the destination
  image: string; // Base64 encoded image or URL
  imageType: 'base64' | 'url' | 'mongodb';
  imageId?: string; // MongoDB GridFS file ID
  originalImageName?: string;
  imageSize?: number;
  features: string[];
  itinerary: Array<{
    day: number;
    title: string;
    description?: string;
    activities: string[];
  }>;
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  bestTimeToVisit: string;
  category: 'romantic' | 'adventure' | 'family' | 'luxury' | 'budget';
  type: string; // Package type (e.g., "Honeymoon", "Candle Night", etc.)
  hotelRating: number; // Hotel star rating (3, 4, or 5)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  days: { type: String, required: true }, // Duration in "X Nights Y Days" format
  destination: { type: String, required: true },
  location: { type: String, required: false },
  image: { type: String, required: true },
  imageType: { 
    type: String, 
    enum: ['base64', 'url', 'mongodb'], 
    default: 'url' 
  },
  imageId: { type: String },
  originalImageName: { type: String },
  imageSize: { type: Number },
  features: [{ type: String }],
  itinerary: [{
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    activities: [{ type: String }]
  }],
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  highlights: [{ type: String }],
  bestTimeToVisit: { type: String },
  category: { 
    type: String, 
    enum: ['romantic', 'adventure', 'family', 'luxury', 'budget'],
    default: 'romantic'
  },
  type: { type: String, required: true }, // Package type
  hotelRating: { 
    type: Number, 
    required: true,
    min: 3,
    max: 5,
    default: 3
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

PackageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better performance
PackageSchema.index({ destination: 1 });
PackageSchema.index({ category: 1 });
PackageSchema.index({ hotelRating: 1 });
PackageSchema.index({ isActive: 1 });
PackageSchema.index({ createdAt: -1 });

const Package = (mongoose.models.Package as mongoose.Model<IPackage>) || mongoose.model<IPackage>('Package', PackageSchema);
export default Package;
