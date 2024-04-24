// Dependencies
// Model
import Order from "../../models/order.js";
import Cart from "../../models/cart.js";
import Product from "../../models/product.js";
import DeliveryOption from "../../models/deliveryOption.js";
// Helper
import stripe from "../../utils/stripe.js";
import { client } from "../../config/keys.js";
const createOrder = async (req, res) => {
    try {
        const user = req.user;
        const cart = await Cart.find({ userId: user._id });
        const products = await Product.find({});
        const deliveryOptions = await DeliveryOption.find({});
        if (cart.length <= 0) {
            return res.status(400).json({
                message: "You don't have items added into your cart yet. Browse now!",
            });
        }
        const lineItems = cart.map((cartItem) => {
            const matchedProduct = products.find((product) => product._id.toString() === cartItem.productId.toString());
            const matchedOption = deliveryOptions.find((deliveryOption) => deliveryOption.type === cartItem.deliveryOption);
            const totalPrice = matchedProduct.priceCents + matchedOption.costCents;
            const taxAmount = Math.round(totalPrice * 0.1);
            const priceWithTax = totalPrice + taxAmount;
            return {
                price_data: {
                    currency: "USD",
                    unit_amount: priceWithTax,
                    product_data: {
                        name: matchedProduct.name + " with shipping fee and tax.",
                    },
                },
                quantity: cartItem.quantity,
            };
        });
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${client.url}/checkout`,
            cancel_url: `${client.url}/checkout`,
            customer_email: user.email,
            line_items: lineItems,
        });
        return res.send(session.url);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const allOrders = async (req, res) => {
    try {
        const user = req.user;
        const orders = await Order.find({ userId: user._id });
        return res.status(200).json({ orders });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export { createOrder, allOrders };
