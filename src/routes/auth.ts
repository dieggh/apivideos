import express from 'express';
import { body } from 'express-validator';
import { postSignIn, postSignUp, postRefreshToken, postSignUpTitular } from '../controllers/AuthController';
import { validateRequest } from '../helpers/validateRequest';
import { PersonaValidation, UsuarioValidation } from '../helpers/validations';
import { isAuthUser, isAuthAdmin } from '../middlewares/isAuth';

const router = express.Router();



router.post('/api/auth/signin',
    new UsuarioValidation().validation,
    postSignIn
);
router.post('/api/auth/refreshToken', postRefreshToken);

router.post('/api/admin/signup', isAuthAdmin,
    new PersonaValidation().validation,
    new UsuarioValidation().validation,
    validateRequest,
    postSignUp);

router.post('/api/admin/signupTitular', isAuthAdmin,
    new PersonaValidation().validation,
    new UsuarioValidation().validation,
    validateRequest,
    postSignUpTitular);


export { router as authRoute }