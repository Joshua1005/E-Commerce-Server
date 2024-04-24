// Dependencies
import { Router } from "express";

// Routes
import authRouter from "./api/auth.js";
import productsRouter from "./api/products.js";
import cartRouter from "./api/cart.js";
import deliveryOptionsRouter from "./api/deliveryOptions.js";
import orderRouter from "./api/order.js";

const router = Router();

router.use("/auth", authRouter);

router.use("/products", productsRouter);

router.use("/cart", cartRouter);

router.use("/deliveryOptions", deliveryOptionsRouter);

router.use("/orders", orderRouter);

export default router;
