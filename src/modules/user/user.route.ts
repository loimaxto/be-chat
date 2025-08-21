import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth.middleware";
import { validateZod } from "../../middlewares/zodValidation";
import { UserController } from "./user.controllers";
import { createUserSchema, loginUserSchema } from "./user.dto";
const router = Router();

const userController = new UserController();
router.post("/register", validateZod(createUserSchema), userController.createUser.bind(userController));
router.post("/login", validateZod(loginUserSchema), userController.loginUser.bind(userController));

router.use(authenticateToken);
router.post("/logout/:id", userController.logoutUser.bind(userController));
router.get("/:id", userController.getUserById.bind(userController));
router.get("/username", userController.getUsersByUsername.bind(userController));
export default router;
