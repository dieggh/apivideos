import express from 'express';
import { body } from 'express-validator';
import { postSignIn, postSignUp, postSignUpEmpleado, postRefreshToken, postSignUpTitular } from '../controllers/AuthController';
import { validateRequest } from '../helpers/validateRequest';
import { PersonaValidation } from '../helpers/validations';
import { isAuthUser, isAuthAdmin } from '../middlewares/isAuth';

const router = express.Router();



router.post('/api/auth/signin', [
    body("email")
        .isEmail()
        .withMessage('El email debe de ser válido'),
    body("password")
        .trim()
        .notEmpty()
        .withMessage('Contraseña requerida')
],
    postSignIn
);
router.post('/api/auth/refreshToken', postRefreshToken);

router.post('/api/admin/signup', isAuthAdmin,
    new PersonaValidation().validation,
    [
        body("password")
            .notEmpty()
            .withMessage("Contraseña Requerida"),            
        body("email")
            .notEmpty()
            .withMessage("Email Requerido")
    ],
    validateRequest,
    postSignUp);

router.post('/api/admin/signupTitular', isAuthAdmin,
    new PersonaValidation().validation,
    [
        body("password")
            .notEmpty()
            .withMessage("Contraseña Requerida"),
        body("email")
            .notEmpty()
            .withMessage("Email Requerido")
    ],
    validateRequest,
    postSignUpTitular);



router.post('/api/admin/registerEmpleado',
    isAuthUser,
    new PersonaValidation().validation,
    [
        body('noInterno')
            .trim()
            .notEmpty()
            .withMessage("Número Interno Requerido")
    ],
    validateRequest,
    postSignUpEmpleado);

export { router as authRoute }