import express from 'express';
import { param } from 'express-validator';
import { deleteDepartamento, getDepartamento, getDepartamentoById, postDepartamento, putDepartamento } from '../controllers/DepartamentoController';
import { validateRequest } from '../helpers/validateRequest';
import { DepartamentoValidation, PersonaValidation } from '../helpers/validations';
import { isAuthUser, isAuthAdmin } from '../middlewares/isAuth';

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
            .withMessage("El parámetro id es requerido")
    ],
    validateRequest,
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
    putDepartamento
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
    deleteDepartamento
);

export { router as departamentoRoute }