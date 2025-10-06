import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth.middleware";
import { validateZod } from "../../middlewares/zodValidation";
const router = Router();
import { MessageController } from './message.controller';


const messageController = new MessageController();

router.use(authenticateToken);

router.get(':conversationId', messageController.getMessages.bind(messageController));
export default router;
