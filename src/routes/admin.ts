import express from 'express';
import { param } from 'express-validator';
import { getAdministradorById, getAdministradores, putAdministrador } from '../controllers/AdminContoller';
import { validateRequest } from '../helpers/validateRequest';
import { PersonaValidation } from '../helpers/validations';
import { isAuthAdmin, isAuthUser } from '../middlewares/isAuth';
import { policyAdmin } from '../middlewares/policyAdministrador';

const router = express.Router();

router.put('/api/admin/:id',
    isAuthUser,
    new PersonaValidation().validation,
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido y debe ser entero")
    ],  
    validateRequest,
    policyAdmin,
    putAdministrador
);

router.get('/api/admin',
    isAuthAdmin,
    getAdministradores
);

router.get('/api/admin/:id',
    isAuthUser,
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido y debe ser entero")
    ], 
    policyAdmin,
    getAdministradorById
);

export { router as adminRouter };