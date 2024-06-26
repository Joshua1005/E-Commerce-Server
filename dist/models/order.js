// Dependencies
import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    cartItems: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: { type: Number, required: true },
            deliveryOption: {
                type: String,
                enum: ["free", "standard", "express"],
                required: true,
            },
        },
    ],
    totalCents: { type: Number, required: true },
}, { timestamps: true });
const Order = mongoose.models.Order ||
    mongoose.model("Order", orderSchema);
export default Order;
