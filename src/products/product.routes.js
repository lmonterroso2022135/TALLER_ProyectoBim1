import { Router } from "express";
import { check } from "express-validator";

import {
    productPost,
    productsGet,
    productPut,
    productDelete
} from "./product.controller.js"

const router = Router();

router.get("/", productsGet);

router.post(
    "/",
    [
        check("productoName", "Product name is required").not().isEmpty(),
        //
        check("description", "Description is required").not().isEmpty(),
        check("stock", "Stock is required").not().isEmpty(),
        check("category", "Category is required").not().isEmpty(), 
        //
    ],productPost
);

router.put(
    "/",
    [
        check("productoName", "Product to edit is required").not().isEmpty(),
        
        check("description", "Description is required").not().isEmpty(),
        check("stock", "Stock is required").not().isEmpty(),
        check("category", "Category is required").not().isEmpty(), 
    ],productPut
);

router.delete(
    "/",
    [
        check("productName", "Product to remove is required").not().isEmpty()
    ],productDelete
)

export default router;