// Model
import DeliveryOption from "../../models/deliveryOption.js";

// Types
import type { Request, Response } from "express";

const allDeliveryOptions = async (_: Request, res: Response) => {
  try {
    const deliveryOptions = await DeliveryOption.find({});

    return res.status(200).json({ deliveryOptions });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export { allDeliveryOptions };
