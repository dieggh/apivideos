import express, { Request, Response } from 'express';
import { postSignIn, postSignUp, postRefreshToken, postSignUpTitular, postSignInMobile, postCheckSesion } from '../controllers/AuthController';
import { validateRequest } from '../helpers/validateRequest';
import { PersonaValidation, UsuarioValidation } from '../helpers/validations';
import { isAuthAdmin, isAuthUser, verifyToken } from '../middlewares/isAuth';
import cors from 'cors';

const router = express.Router();

router.post('/api/auth/mobile/signin', cors(),
    new UsuarioValidation().validation,
    postSignInMobile
);

router.post('/api/auth/signin',
    new UsuarioValidation().validation,
    postSignIn
);

router.post('/api/auth/refreshToken', postRefreshToken);

router.get('/api/auth/check', verifyToken, postCheckSesion);

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