import express from 'express';
import { body, param } from 'express-validator';
import { deleteEmpleado, getEmpleadoById, getEmpleadoCapacitaciones, getEmpleadoCapitulos, getEmpleados, getEstados, patchEnableEmpleado, postAsignarDepartamento, postEmpleado, putEmpleado } from '../controllers/EmpleadoController';

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

router.get('/api/estado',    
    getEstados
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

router.get('/api/empleado/:id/capitulos/:idCategoria',
    isAuthUser,
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro idEmpleado es requerido y debe ser entero"),
        param('idCategoria')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro idEmpleado es requerido y debe ser entero")
    ],
    validateRequest,
    policyEmpleado,
    getEmpleadoCapitulos
);

router.get('/api/empleado/:id/capacitaciones',
    isAuthUser,
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido y debe ser entero")
    ],
    validateRequest,
    policyEmpleado,
    getEmpleadoCapacitaciones
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

router.delete('/api/empleado/:id',
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

router.patch('/api/empleado/:id',
    isAuthUser,
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido")
    ],
    validateRequest,
    policyEmpleado,
    patchEnableEmpleado
);

/*router.post('/api/departamento/asignarDepartamento/:id',
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
);*/

export { router as empleadoRoute }