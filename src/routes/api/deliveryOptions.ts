// Dependencies
import { Router } from "express";

// Controllers
import { allDeliveryOptions } from "../../controllers/deliveryOptions/index.js";

// Middlewares
import { auth } from "../../middlewares/auth.js";

const router = Router();

router.get("/", auth, allDeliveryOptions);

export default router;
