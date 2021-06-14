import express from 'express';
import { body } from 'express-validator';
import { postSignIn, postSignUp, postSignUpEmpleado } from '../controllers/AuthController';
import { validateRequest } from '../helpers/validateRequest';
import { PersonaValidation } from '../helpers/validations';

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

router.post('/api/admin/signup', 
    new PersonaValidation().validation,
    [
        body("password")
            .notEmpty()
            .withMessage("Contraseña Requerida")
    ],
    validateRequest,
    postSignUp );


router.post('/api/admin/registerEmpleado', 
    new PersonaValidation().validation,
    [
        body('noInterno')
            .trim()
            .notEmpty()
            .withMessage("Número Interno Requerido")
    ]
, postSignUpEmpleado);

export { router as authRoute }