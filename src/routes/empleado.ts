import express from 'express';
import { body, param } from 'express-validator';
import { deleteEmpleado, getEmpleadoById, getEmpleados, postAsignarDepartamento, postEmpleado, putEmpleado } from '../controllers/EmpleadoController';

import { validateRequest } from '../helpers/validateRequest';
import { PersonaValidation, UsuarioValidation } from '../helpers/validations';
import { isAuthUser } from '../middlewares/isAuth';
import { policyEmpleado } from '../middlewares/policyEmpleado';

const router = express.Router();

router.post('/api/empleado',
    isAuthUser,
    new PersonaValidation().validation,
    new UsuarioValidation().validation,
    [
        body('noInterno')
            .trim()
            .notEmpty()
            .withMessage("Número Interno Requerido")
    ],
    validateRequest,
    postEmpleado
);

router.get('/api/empleado',
    isAuthUser,
    getEmpleados
);

router.get('/api/empleado/:id',
    isAuthUser,
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido y debe ser entero")
    ],
    validateRequest,
    getEmpleadoById
);

router.put('/api/empleado/:id',
    isAuthUser,
    new PersonaValidation().validation, 
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido"),        
    ],
    validateRequest,
    policyEmpleado,
    putEmpleado
);

router.delete('/api/departamento',
    isAuthUser,
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido")
    ],
    validateRequest,
    policyEmpleado,
    deleteEmpleado
);

router.post('/api/departamento/asignarDepartamento',
    isAuthUser,
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido")
    ],
    validateRequest,
    policyEmpleado,
    postAsignarDepartamento
)

export { router as empleadoRoute }