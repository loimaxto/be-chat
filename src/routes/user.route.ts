import {Router} from 'express'
import { createUser, loginUser } from '../controllers/user.controllers';
import { validateZod } from '../middlewares/zodValidation';
import { createUserSchema, loginUserSchema } from '../dtos/user.dto';
const router = Router();

//user route
router.get('/', (req, res) => {
  res.json({ message: 'User route' });
});


router.post('/register', validateZod(createUserSchema), createUser);
router.post('/login', validateZod(loginUserSchema), loginUser);

export default router;