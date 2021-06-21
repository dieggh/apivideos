import { Router } from "express";
import { body, param } from "express-validator";
import { getCapituloById, getCapitulos, getPerfil, postIniciarCapitulo, putEmpleado, putFinalizarCapitulo } from "../controllers/EmpleadoController";
import { validateRequest } from "../helpers/validateRequest";
import { isAuthEmployer } from "../middlewares/isAuth";
import { policyEmpleadoCapitulo } from "../middlewares/policyCapitulo";

const router = Router();

router.get('/api/mobile/empleado',
    isAuthEmployer,    
    getPerfil
);

router.put('/api/mobile/empleado',
    isAuthEmployer,
    putEmpleado
);

router.get('/api/mobile/capitulo',
    isAuthEmployer,    
    getCapitulos
);

router.get('/api/mobile/capitulo/:id',
    isAuthEmployer,
    [
        param('id')
            .notEmpty().withMessage("id requerido")
            .isNumeric().withMessage("El valor debe de ser entero")
    ],
    validateRequest,
    policyEmpleadoCapitulo,    
    getCapituloById
);

router.post('/api/mobile/iniciarCapitulo',
    isAuthEmployer,
    [
        body('idCapitulo')
            .notEmpty().withMessage("idCapitulo Requerido")
            .isNumeric().withMessage("idCapitulo debe de ser un entero")
    ],
    validateRequest,
    policyEmpleadoCapitulo,
    postIniciarCapitulo   
);

router.put('/api/mobile/FinalizarCapitulo',
    isAuthEmployer,
    [
        body('idCapitulo')
            .notEmpty().withMessage("idCapitulo Requerido")
            .isNumeric().withMessage("idCapitulo debe de ser un entero")
    ],
    validateRequest,
    policyEmpleadoCapitulo,
    putFinalizarCapitulo
);

export {
    router as empleadoMobileRouter
}