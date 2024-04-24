import mongoose from "mongoose";
import type { InferSchemaType, Model } from "mongoose";

interface DeliveryOptionSchema
  extends InferSchemaType<typeof deliveryOptionSchema> {}

const deliveryOptionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["free", "standard", "express"],
    default: "free",
    required: true,
  },
  costCents: { type: Number, enum: [0, 499, 999], default: 0, required: true },
  day: { type: Number, enum: [1, 3, 7], default: 1, required: true },
});

const DeliveryOption: Model<DeliveryOptionSchema> =
  mongoose.models.DeliveryOption ||
  mongoose.model("DeliveryOption", deliveryOptionSchema);

export type { DeliveryOptionSchema };
export default DeliveryOption;
