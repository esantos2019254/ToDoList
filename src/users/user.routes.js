import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUserById, updateUser, deleteUser } from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { uploadProfilePicture } from "../middlewares/multer-upload.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js"
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js";

const router = Router();

router.get("/", getUsers);

router.get(
    "/findUser/",
    [
        validarJWT,
        validarCampos
    ],
    getUserById
)

router.put(
    "/updateUser",
    uploadProfilePicture.single('profilePicture'),
    validarJWT,
    deleteFileOnError,
    updateUser
)

router.delete(
    "/deleteUser",
    validarJWT,
    deleteUser
)

export default router;