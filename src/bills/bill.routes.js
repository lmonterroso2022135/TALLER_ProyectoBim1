import { Router } from "express";
import { check } from "express-validator";

import {
    payPurchase
} from "./bill.controller.js"

import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

router.post(
    "/",
    validateJWT,
    payPurchase
);

export default router;