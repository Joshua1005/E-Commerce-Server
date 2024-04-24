// Dependencies
import mongoose from "mongoose";
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
const Product = mongoose.models.Product ||
    mongoose.model("Product", productSchema);
export default Product;
