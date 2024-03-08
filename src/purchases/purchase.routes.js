import { Router } from "express";
import { check } from "express-validator";

import {
    shoppingCart
} from "./purchase.controller.js"

import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

router.post(
    "/",
    
        validateJWT,
        // check("productoName", "Product name is required").not().isEmpty(),
        // ch
    shoppingCart
);

export default router;