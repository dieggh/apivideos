"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.empleadoRoute = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const EmpleadoController_1 = require("../controllers/EmpleadoController");
const validateRequest_1 = require("../helpers/validateRequest");
const validations_1 = require("../helpers/validations");
const isAuth_1 = require("../middlewares/isAuth");
const policyEmpleado_1 = require("../middlewares/policyEmpleado");
const router = express_1.default.Router();
exports.empleadoRoute = router;
router.post('/api/empleado', isAuth_1.isAuthUser, new validations_1.PersonaValidation().validation, new validations_1.UsuarioValidation().validation, [
    express_validator_1.body('noInterno')
        .trim()
        .notEmpty()
        .withMessage("Número Interno Requerido")
], validateRequest_1.validateRequest, EmpleadoController_1.postEmpleado);
router.get('/api/empleado', isAuth_1.isAuthUser, EmpleadoController_1.getEmpleados);
router.get('/api/empleado/:id', isAuth_1.isAuthUser, [
    express_validator_1.param('id')
        .notEmpty()
        .isNumeric()
        .withMessage("El parámetro id es requerido y debe ser entero")
], validateRequest_1.validateRequest, EmpleadoController_1.getEmpleadoById);
router.put('/api/empleado/:id', isAuth_1.isAuthUser, new validations_1.PersonaValidation().validation, [
    express_validator_1.param('id')
        .notEmpty()
        .isNumeric()
        .withMessage("El parámetro id es requerido"),
], validateRequest_1.validateRequest, policyEmpleado_1.policyEmpleado, EmpleadoController_1.putEmpleado);
router.delete('/api/departamento', isAuth_1.isAuthUser, [
    express_validator_1.param('id')
        .notEmpty()
        .isNumeric()
        .withMessage("El parámetro id es requerido")
], validateRequest_1.validateRequest, policyEmpleado_1.policyEmpleado, EmpleadoController_1.deleteEmpleado);
router.post('/api/departamento/asignarDepartamento/:id', isAuth_1.isAuthUser, [
    express_validator_1.param('id')
        .notEmpty()
        .isNumeric()
        .withMessage("El parámetro id es requerido")
], validateRequest_1.validateRequest, policyEmpleado_1.policyEmpleado, EmpleadoController_1.postAsignarDepartamento);
