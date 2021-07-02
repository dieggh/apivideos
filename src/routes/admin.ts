import express from 'express';
import { param } from 'express-validator';
import { deleteAdministrador, getAdministradorById, getAdministradores, getAdministradorPerfil, patchEnableAdministrador, putAdministrador } from '../controllers/AdminContoller';
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

router.delete('/api/admin/:id',
    isAuthAdmin,
    [
        param('id')
            .notEmpty().withMessage("El parámetro id es requerido")
            .isNumeric().withMessage("El parámetro id debe ser entero")
            
    ],
    policyAdmin,
    deleteAdministrador
);

router.patch('/api/admin/:id',
    isAuthAdmin,
    [
        param('id')
            .notEmpty().withMessage("El parámetro id es requerido")
            .isNumeric().withMessage("El parámetro id debe ser entero")
            
    ],
    policyAdmin,
    patchEnableAdministrador    
);

router.get('/api/adminPerfil',
    isAuthUser,    
    getAdministradorPerfil
)

export { router as adminRouter };