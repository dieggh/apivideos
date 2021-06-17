import { Router } from 'express';
import { body, param } from 'express-validator';
import { deleteCategoria, getCategoriaById, getCategorias, postCategoria, putCategoria } from '../controllers/CategoriaController';
import { validateRequest } from '../helpers/validateRequest';
import { isAuthUser } from '../middlewares/isAuth';
import { policyCategoria } from '../middlewares/policyCategoria';

const router = Router();

router.post('/api/categoria',
    isAuthUser,
    [
        body('nombre')
            .notEmpty()
            .withMessage("Nombre es Requerido")
    ],
    validateRequest,
    postCategoria
);

router.put('/api/categoria/:id',
    isAuthUser,
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido y debe ser entero"),
        body('nombre')
            .notEmpty()
            .withMessage("Nombre es Requerido")
    ],
    validateRequest,
    policyCategoria,
    putCategoria
);

router.get('/api/categoria/:id',
    isAuthUser,
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido y debe ser entero")      
    ],
    validateRequest,
    policyCategoria,
    getCategoriaById
);

router.get('/api/categoria',
    isAuthUser,    
    validateRequest,
    getCategorias
);

router.delete('/api/categoria/:id',
    isAuthUser,
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido y debe ser entero"),
    ],
    validateRequest,
    policyCategoria,
    deleteCategoria
);

export {
    router as categoriaRouter
}