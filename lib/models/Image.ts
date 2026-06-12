import mongoose, { Document, Schema } from 'mongoose';

export interface IImage extends Document {
  filename: string;
  originalName: string;
  contentType: string;
  size: number;
  data: Buffer;
  destination: string;
  uploadedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  contentType: { type: String, required: true },
  size: { type: Number, required: true },
  data: { type: Buffer, required: true },
  destination: { type: String, required: true },
  uploadedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ImageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better performance
ImageSchema.index({ destination: 1 });
ImageSchema.index({ createdAt: -1 });
ImageSchema.index({ filename: 1 });

const ImageModel = (mongoose.models.Image as mongoose.Model<IImage>) || mongoose.model<IImage>('Image', ImageSchema);
export default ImageModel;
