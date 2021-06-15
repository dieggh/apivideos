import express from 'express';
import { getDepartamento } from '../controllers/DepartamentoController';
import { validateRequest } from '../helpers/validateRequest';
import { DepartamentoValidation, PersonaValidation } from '../helpers/validations';
import { isAuthUser, isAuthAdmin } from '../middlewares/isAuth';

const router = express.Router();

router.post('/api/departamento', 
    isAuthUser,
    new DepartamentoValidation().validation,
    validateRequest,

);

router.get('/api/departamento', 
    isAuthUser,
    new DepartamentoValidation().validation,
    getDepartamento          
);


export { router as departamentoRoute }