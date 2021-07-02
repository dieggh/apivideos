"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.empleadoMobileRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const EmpleadoController_1 = require("../controllers/EmpleadoController");
const validateRequest_1 = require("../helpers/validateRequest");
const isAuth_1 = require("../middlewares/isAuth");
const policyCapitulo_1 = require("../middlewares/policyCapitulo");
const policyEmpleado_1 = require("../middlewares/policyEmpleado");
const router = express_1.Router();
exports.empleadoMobileRouter = router;
router.get('/api/mobile/empleado', isAuth_1.isAuthEmployer, EmpleadoController_1.getPerfil);
router.put('/api/mobile/empleado', isAuth_1.isAuthEmployer, policyEmpleado_1.policyEmpleado, EmpleadoController_1.putEmpleado);
router.get('/api/mobile/capitulo', isAuth_1.isAuthEmployer, EmpleadoController_1.getCapitulos);
router.get('/api/mobile/capitulo/:id', isAuth_1.isAuthEmployer, [
    express_validator_1.param('id')
        .notEmpty().withMessage("id requerido")
        .isNumeric().withMessage("El valor debe de ser entero")
], validateRequest_1.validateRequest, policyCapitulo_1.policyEmpleadoCapitulo, EmpleadoController_1.getCapituloById);
router.post('/api/mobile/iniciarCapitulo', isAuth_1.isAuthEmployer, [
    express_validator_1.body('idCapitulo')
        .notEmpty().withMessage("idCapitulo Requerido")
        .isNumeric().withMessage("idCapitulo debe de ser un entero")
], validateRequest_1.validateRequest, policyCapitulo_1.policyEmpleadoCapitulo, EmpleadoController_1.postIniciarCapitulo);
router.put('/api/mobile/finalizarCapitulo', isAuth_1.isAuthEmployer, [
    express_validator_1.body('idCapitulo')
        .notEmpty().withMessage("idCapitulo Requerido")
        .isNumeric().withMessage("idCapitulo debe de ser un entero")
], validateRequest_1.validateRequest, policyCapitulo_1.policyEmpleadoCapitulo, EmpleadoController_1.putFinalizarCapitulo);
