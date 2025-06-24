import {Router} from 'express'
import { createUser, loginUser } from '../controllers/user.controllers';
import { validateZod } from '../middlewares/zodValidation';
import { createUserSchema, loginUserSchema } from '../dtos/user.dto';
import { authenticateToken } from '../middlewares/auth.middleware';
const router = Router();

router.post('/register', validateZod(createUserSchema), createUser);
router.post('/login', validateZod(loginUserSchema), loginUser);

router.use(authenticateToken);
router.get("/all-user", (req, res) => {
  res.json({ message: 'All users' });
});
export default router;