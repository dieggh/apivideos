import express, { Request, Response } from 'express';
import { postSignIn, postSignUp, postRefreshToken, postSignUpTitular, postSignInMobile, postCheckSesion, postMobileRefreshToken } from '../controllers/AuthController';
import { validateRequest } from '../helpers/validateRequest';
import { PersonaValidation, UsuarioValidation } from '../helpers/validations';
import { isAuthAdmin, isAuthUser, verifyToken } from '../middlewares/isAuth';
import cors from 'cors';
import { body } from 'express-validator';

const router = express.Router();

router.post('/api/auth/mobile/signin', cors(),
    [
        body("password")
            .trim()
            .isLength({
                min: 6,
                max: 16
            })
            .withMessage("Contraseña Requerida"),
        body("email")
            .isEmpty().withMessage("Correo Electrónico requerido")
            .isEmail()
            .withMessage("Correo Electrónico no válido"),
    ],
    validateRequest,
    postSignInMobile
);
router.post('/api/auth/mobile/refreshToken', cors(), postMobileRefreshToken);

router.post('/api/auth/signin',
    [
        body("password")
            .trim()
            .isLength({
                min: 6,
                max: 16
            })
            .withMessage("Contraseña Requerida"),
        body("email")
            .notEmpty().withMessage("Correo Electrónico requerido")
            .isEmail().withMessage("Correo Electrónico no válido"),
    ],
    validateRequest,
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