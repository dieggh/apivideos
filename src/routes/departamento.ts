import express from 'express';
import { param } from 'express-validator';
import { deleteDepartamento, getDepartamento, getDepartamentoById, getDepartamentoCategorias, patchEnableDepartamento, postDepartamento, putDepartamento } from '../controllers/DepartamentoController';
import { validateRequest } from '../helpers/validateRequest';
import { DepartamentoValidation, PersonaValidation } from '../helpers/validations';
import { isAuthUser, isAuthAdmin } from '../middlewares/isAuth';
import { policyDepartamento } from '../middlewares/policyDepartamento';

const router = express.Router();

router.post('/api/departamento',
    isAuthUser,
    new DepartamentoValidation().validation,
    validateRequest,
    postDepartamento
);

router.get('/api/departamento',
    isAuthUser,
    getDepartamento
);

router.get('/api/departamento/:id',
    isAuthUser,
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido y debe ser entero")
    ],
    validateRequest,
    policyDepartamento,
    getDepartamentoById
);

router.put('/api/departamento/:id',
    isAuthUser,
    new DepartamentoValidation().validation,
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido")
    ],
    validateRequest,
    policyDepartamento,
    putDepartamento
);

router.delete('/api/departamento/:id',
    isAuthUser,
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido")
    ],
    validateRequest,
    policyDepartamento,
    deleteDepartamento
);

router.patch('/api/departamento/:id',
    isAuthUser,
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido")
    ],
    validateRequest,
    policyDepartamento,
    patchEnableDepartamento
    
);

router.get('/api/departamento/:id/categorias',
    isAuthUser,
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido")
    ],
    validateRequest,
    policyDepartamento,
    getDepartamentoCategorias
);

export { router as departamentoRoute }