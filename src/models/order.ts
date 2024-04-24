// Dependencies
import mongoose from "mongoose";

// Types
import type { InferSchemaType, Model } from "mongoose";

interface OrderSchema extends InferSchemaType<typeof orderSchema> {}

const orderSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const Order: Model<OrderSchema> =
  mongoose.models.Order ||
  mongoose.model<Model<OrderSchema>>("Order", orderSchema);

export type { OrderSchema };
export default Order;
