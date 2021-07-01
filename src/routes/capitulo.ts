import { Router } from 'express';
import { body, param } from 'express-validator';
import { deleteCapitulo, getCapitulos, getCapitulosById, patchEnableCapitulo, postCapitulo, putCapitulo } from '../controllers/CapituloController';
import { validateRequest } from '../helpers/validateRequest';
import { CapituloValidation } from '../helpers/validations';
import { isAuthUser } from '../middlewares/isAuth';
import { policyCapitulo } from '../middlewares/policyCapitulo';

const router = Router();

router.post('/api/capitulo',
    isAuthUser,
    new CapituloValidation().validation,
    validateRequest,
    postCapitulo
);

router.put('/api/capitulo/:id',
    isAuthUser,    
    [
        body("nombre")
            .notEmpty()
            .withMessage("Nombre requerido"),
        body("tipo")
            .notEmpty()
            .withMessage("Tipo del recurso requerido"),
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido y debe ser entero")
    ],
    validateRequest,
    policyCapitulo,
    putCapitulo
);

router.get('/api/capitulo/:id',
    isAuthUser,
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido y debe ser entero")      
    ],
    validateRequest,
    policyCapitulo,
    getCapitulosById
);

router.get('/api/capitulo',
    isAuthUser,    
    validateRequest,
    getCapitulos
);

router.delete('/api/capitulo/:id',
    isAuthUser,
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido y debe ser entero"),
    ],
    validateRequest,
    policyCapitulo,
    deleteCapitulo
);


router.patch('/api/capitulo/:id',
    isAuthUser,
    [
        param('id')
            .notEmpty()
            .isNumeric()
            .withMessage("El parámetro id es requerido y debe ser entero"),
    ],
    validateRequest,
    policyCapitulo,
    patchEnableCapitulo
);

export {
    router as capituloRouter
}