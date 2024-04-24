// Dependencies
import { Router } from "express";
// Controllers
import { allProducts, searchProduct, } from "../../controllers/products/index.js";
// Middlewares
import { auth } from "../../middlewares/auth.js";
const router = Router();
router.get("/", auth, allProducts);
router.get("/:searchText", auth, searchProduct);
export default router;
