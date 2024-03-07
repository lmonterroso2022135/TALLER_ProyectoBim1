import { Router } from "express";
import { check } from "express-validator";
import {
    userPost, 
    usersGet, 
    userPut,
    userDelete,
    register
    } from "./user.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { validateCampos } from "../middlewares/validate-campos.js";
import { emailExists} from "../helpers/db-validators.js";

const router = Router();

router.get("/", usersGet);

router.post(
    "/", [
        check("name", "The name is required").not().isEmpty(),
        check("password", "Password must be greater than 6 characters").isLength({min: 6,}),
        check("email", "The email entered is not valid ").isEmail(),
        check("email").custom(emailExists),
        check("role", "The role is required.").not().isEmpty(),
        validateCampos
    ],userPost
);

router.post(
    "/register",
    [
        check("name", "The name is required").not().isEmpty(),
        check("password", "Password must be greater than 6 characters").isLength({min: 6,}),
        check("email", "The email entered is not valid ").isEmail(),
        check("email").custom(emailExists),
        validateCampos  
    ],register
)

router.put(
    "/",[
        validateJWT,
        check("name", "The name is required").not().isEmpty(),
        check("role", "The role is required.").not().isEmpty(),
    ],userPut
);

router.delete(
    "/",
    validateJWT,
    userDelete
);

export default router;
