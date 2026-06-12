import mongoose, { Document, Schema } from 'mongoose';

export interface ITopDestination {
  name: string;
  description: string;
  image: string;
  path: string;
}

export interface ITopDestinationAttraction {
  name: string;
  description: string;
  image: string;
}

export interface IPackage {
  id: string;
  image: string;
  days: string;
  title: string;
  location: string;
  price: string;
  type: string;
  hotelRating: number;
  features: string[];
  highlights: string;
}

export interface IPopularDestination {
  name: string;
  image: string;
  packages: IPackage[];
  topDestinations: ITopDestinationAttraction[];
}

export interface IPopularPackages {
  destinations: IPopularDestination[];
}

export interface IHomeContent extends Document {
  topDestinations: ITopDestination[];
  popularPackages: IPopularPackages;
  createdAt: Date;
  updatedAt: Date;
}

const TopDestinationSchema = new Schema<ITopDestination>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  path: { type: String, required: true }
}, { _id: false });

const TopDestinationAttractionSchema = new Schema<ITopDestinationAttraction>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }
}, { _id: false });

const PackageSchema = new Schema<IPackage>({
  id: { type: String, required: true },
  image: { type: String, required: true },
  days: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: String, required: true },
  type: { type: String, required: true },
  hotelRating: { type: Number, required: true, min: 1, max: 5 },
  features: [{ type: String }],
  highlights: { type: String, required: true }
}, { _id: false });

const PopularDestinationSchema = new Schema<IPopularDestination>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  packages: [PackageSchema],
  topDestinations: [TopDestinationAttractionSchema]
}, { _id: false });

const PopularPackagesSchema = new Schema<IPopularPackages>({
  destinations: [PopularDestinationSchema]
}, { _id: false });

const HomeContentSchema = new Schema<IHomeContent>({
  topDestinations: [TopDestinationSchema],
  popularPackages: PopularPackagesSchema
}, {
  timestamps: true,
  collection: 'homecontent'
});

// Create a compound index for better query performance
HomeContentSchema.index({ createdAt: -1 });

const HomeContent = (mongoose.models.HomeContent as mongoose.Model<IHomeContent>) || mongoose.model<IHomeContent>('HomeContent', HomeContentSchema);
export default HomeContent;
