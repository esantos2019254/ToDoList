import { Router } from "express";
import { check } from "express-validator";
import { getTasks, addTask, getTasksByUser, updateTask, deleteTask } from "../task/task.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { uploadTaskPicture } from "../middlewares/multer-upload.js";
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    "/addTask",
    validarJWT,
    uploadTaskPicture.single("img"),
    deleteFileOnError,
    addTask
);

router.get("/", validarJWT, tieneRole("ADMIN_ROLE"), getTasks);

router.get(
    "/taskByUser",
    [
        validarJWT,
        validarCampos
    ],
    getTasksByUser
);

router.put(
  "/updateTask/:taskId",
  validarJWT,
  uploadTaskPicture.single("img"),
  deleteFileOnError,
  updateTask
);

router.delete("/deleteTask/:taskId", validarJWT, deleteTask);

export default router;
