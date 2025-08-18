import { Router } from "express";
import { UserController } from "./user.controllers";
import { validateZod } from "../../middlewares/zodValidation";
import { createUserSchema, loginUserSchema } from "./user.dto";
import { authenticateToken } from "../../middlewares/auth.middleware";
const router = Router();

const userController = new UserController();
router.post("/register", validateZod(createUserSchema), userController.createUser);
router.post("/login", validateZod(loginUserSchema), userController.loginUser);

router.use(authenticateToken);
router.post("/logout/:id", userController.logoutUser);
router.get("/:id", userController.getUserById);
router.get("/name/:username", userController.getUsersByUsername);
export default router;
