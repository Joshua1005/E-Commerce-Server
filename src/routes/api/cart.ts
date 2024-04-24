// Dependencies
import { Router } from "express";

// Controllers
import {
  addOrUpdateCartItem,
  allCartItem,
  deleteCartItem,
  totalItem,
  updateCartItem,
} from "../../controllers/cart/index.js";

// Middlewares
import { auth } from "../../middlewares/auth.js";

const router = Router();

router.get("/", auth, allCartItem);

router.post("/:productId", auth, addOrUpdateCartItem);

router.put("/:productId", auth, updateCartItem);

router.delete("/:productId", auth, deleteCartItem);

router.get("/totalQuantity", auth, totalItem);

export default router;
