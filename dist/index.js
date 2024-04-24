// Dependencies
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// Helpers
import { server, stripeKey } from "./config/keys.js";
import connectDB from "./libs/connectDB.js";
import setupPassword from "./config/passport.js";
import corsOptions from "./config/cors.js";
import stripe from "./utils/stripe.js";
// Routes
import router from "./routes/index.js";
// Models
import Cart from "./models/cart.js";
import Product from "./models/product.js";
import Order from "./models/order.js";
import User from "./models/user.js";
const app = express();
connectDB();
setupPassword(app);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
        return res.status(400).json({ message: "No stripe signature defined." });
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, stripeKey.webhookSecret);
    }
    catch (err) {
        return res.status(400).json(`Webhook Error: ${err.message}`);
    }
    // Handle the event
    switch (event.type) {
        case "checkout.session.completed":
            const data = event.data.object;
            const email = data.customer_email;
            const user = await User.findOne({ email });
            if (!user) {
                return;
            }
            const cart = await Cart.find({ userId: user._id });
            const products = await Product.find({});
            const totalCents = cart.reduce((total, cartItem) => {
                const matchedProducts = products.find((product) => {
                    return product._id
                        .toString()
                        .includes(cartItem.productId.toString());
                });
                return (total += cartItem.quantity * matchedProducts.priceCents);
            }, 0);
            await Order.create({
                userId: user._id,
                cartItems: cart.map((cartItem) => {
                    return {
                        productId: cartItem.productId,
                        quantity: cartItem.quantity,
                        deliveryOption: cartItem.deliveryOption,
                    };
                }),
                totalCents,
            });
            await Cart.deleteMany({ userId: user._id });
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    return res.send().end();
});
app.use("/", (_, res) => {
    return res.send("E Commerce Client Side");
});
app.use(express.json());
app.use("/api", router);
app.listen(server.port, () => {
    console.log(`Server running on port:${server.port}`);
    console.log(`http://localhost:${server.port}`);
});
