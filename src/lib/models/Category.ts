import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

CategorySchema.index({ name: 1 });
CategorySchema.index({ slug: 1 });

export default mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
