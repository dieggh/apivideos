"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.departamentoRoute = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const DepartamentoController_1 = require("../controllers/DepartamentoController");
const validateRequest_1 = require("../helpers/validateRequest");
const validations_1 = require("../helpers/validations");
const isAuth_1 = require("../middlewares/isAuth");
const policyDepartamento_1 = require("../middlewares/policyDepartamento");
const router = express_1.default.Router();
exports.departamentoRoute = router;
router.post('/api/departamento', isAuth_1.isAuthUser, new validations_1.DepartamentoValidation().validation, validateRequest_1.validateRequest, DepartamentoController_1.postDepartamento);
router.get('/api/departamento', isAuth_1.isAuthUser, DepartamentoController_1.getDepartamento);
router.get('/api/departamento/:id', isAuth_1.isAuthUser, [
    express_validator_1.param('id')
        .notEmpty()
        .isNumeric()
        .withMessage("El parámetro id es requerido y debe ser entero")
], validateRequest_1.validateRequest, policyDepartamento_1.policyDepartamento, DepartamentoController_1.getDepartamentoById);
router.put('/api/departamento/:id', isAuth_1.isAuthUser, new validations_1.DepartamentoValidation().validation, [
    express_validator_1.param('id')
        .notEmpty()
        .isNumeric()
        .withMessage("El parámetro id es requerido")
], validateRequest_1.validateRequest, policyDepartamento_1.policyDepartamento, DepartamentoController_1.putDepartamento);
router.delete('/api/departamento', isAuth_1.isAuthUser, [
    express_validator_1.param('id')
        .notEmpty()
        .isNumeric()
        .withMessage("El parámetro id es requerido")
], validateRequest_1.validateRequest, policyDepartamento_1.policyDepartamento, DepartamentoController_1.deleteDepartamento);
