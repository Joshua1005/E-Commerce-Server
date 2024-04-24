// Dependencies
import { Router } from "express";

// Controllers
import { allOrders, createOrder } from "../../controllers/orders/index.js";

// Middlewares
import { auth } from "../../middlewares/auth.js";

const router = Router();

router.get("/", auth, allOrders);

router.post("/", auth, createOrder);

export default router;
