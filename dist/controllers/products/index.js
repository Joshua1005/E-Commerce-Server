// Model
import Product from "../../models/product.js";
const allProducts = async (_, res) => {
    try {
        const products = await Product.find({});
        return res.status(200).json({ products });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const searchProduct = async (req, res) => {
    try {
        const { searchText } = req.params;
        const products = await Product.find({
            $or: [
                { name: { $regex: searchText, $options: "i" } },
                { keywords: { $regex: searchText, $options: "i" } },
            ],
        });
        return res.status(200).json({ products });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export { allProducts, searchProduct };
