import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    deliveryOption: {
        type: String,
        enum: ["free", "standard", "express"],
        required: true,
        default: "free",
    },
}, { timestamps: true });
const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;
