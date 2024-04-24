// Dependencies
import mongoose from "mongoose";

// Types
import type { InferSchemaType, Model } from "mongoose";

interface ProductSchema extends InferSchemaType<typeof productSchema> {}

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  priceCents: { type: Number, required: true, min: 0, default: 0 },
  rating: {
    stars: { type: Number, min: 0, max: 5, default: 0 },
    count: { type: Number, min: 0, default: 0 },
  },
  keywords: [{ type: String, required: true }],
});

const Product: Model<ProductSchema> =
  mongoose.models.Product ||
  mongoose.model<Model<ProductSchema>>("Product", productSchema);

export type { ProductSchema };
export default Product;
