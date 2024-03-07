import { Router } from "express";
import { check } from "express-validator";
import {
    categoriesGet,
    categoryPost,
    categoryDelete,
    categoryPut
    } from "./category.controller.js"
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { isAdmin } from "../middlewares/validate-roles.js";
import { categoryExists } from "../helpers/db-validators.js";

    const router = Router();

    router.get("/", categoriesGet);
    
    router.post(
        "/", [
            validarJWT,
            isAdmin,
            check("categoryName", "The username is required").not().isEmpty(),
            check("categoryName").custom(categoryExists),
            check("description", "The username is required").not().isEmpty(),
            validarCampos
        ],categoryPost
    );

    router.put(
        "/:id",
        [
            validarJWT,
            isAdmin,
            check("categoryName", "The username is required").not().isEmpty(),
            check("categoryName").custom(categoryExists),
            check("description", "The username is required").not().isEmpty(),
        ],categoryPut
    );

    router.delete(
        "/:id",
        validarJWT,
        isAdmin,
        categoryDelete
    );

    
export default router;