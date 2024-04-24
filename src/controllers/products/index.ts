// Model
import Product from "../../models/product.js";

// Types
import type { Request, Response } from "express";

const allProducts = async (_: Request, res: Response) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

const searchProduct = async (req: Request, res: Response) => {
  try {
    const { searchText } = req.params;

    const products = await Product.find({
      $or: [
        { name: { $regex: searchText, $options: "i" } },
        { keywords: { $regex: searchText, $options: "i" } },
      ],
    });

    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export { allProducts, searchProduct };
