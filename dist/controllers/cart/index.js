// Model
import Cart from "../../models/cart.js";
const allCartItem = async (req, res) => {
    try {
        const user = req.user;
        const cart = await Cart.find({ userId: user._id });
        return res.status(200).json({ cart });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const addOrUpdateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity, deliveryOption } = req.body;
        const user = req.user;
        let cartItem = await Cart.findOne({ productId, userId: user._id });
        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        }
        else {
            cartItem = await Cart.create({
                userId: user._id,
                productId,
                quantity,
                deliveryOption,
            });
        }
        return res.status(201).json({ cartItem });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { deliveryOption } = req.body;
        const user = req.user;
        const cartItem = await Cart.findOne({ productId, userId: user._id });
        cartItem.deliveryOption = deliveryOption;
        await cartItem?.save();
        return res.status(200).json({ cartItem });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const deleteCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = req.user;
        await Cart.findOneAndDelete({
            productId,
            userId: user._id,
        });
        return res
            .status(204)
            .json({ message: "Successfully deleted item from the cart." });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const totalItem = async (req, res) => {
    try {
        const user = req.user;
        const cart = await Cart.find({ userId: user._id });
        if (cart.length <= 0) {
            return res.status(200).json({ totalItem: 0 });
        }
        const totalItem = cart.reduce((prev, cartItem) => (prev += cartItem.quantity), 0);
        return res.status(200).json({ totalItem });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export { allCartItem, addOrUpdateCartItem, updateCartItem, deleteCartItem, totalItem, };
