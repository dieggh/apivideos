"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capituloRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const CapituloController_1 = require("../controllers/CapituloController");
const validateRequest_1 = require("../helpers/validateRequest");
const validations_1 = require("../helpers/validations");
const isAuth_1 = require("../middlewares/isAuth");
const policyCapitulo_1 = require("../middlewares/policyCapitulo");
const router = express_1.Router();
exports.capituloRouter = router;
router.post('/api/capitulo', isAuth_1.isAuthUser, new validations_1.CapituloValidation().validation, validateRequest_1.validateRequest, CapituloController_1.postCapitulo);
router.put('/api/capitulo/:id', isAuth_1.isAuthUser, [
    express_validator_1.body("nombre")
        .notEmpty()
        .withMessage("Nombre requerido"),
    express_validator_1.body("tipo")
        .notEmpty()
        .withMessage("Tipo del recurso requerido"),
    express_validator_1.param('id')
        .notEmpty()
        .isNumeric()
        .withMessage("El parámetro id es requerido y debe ser entero")
], validateRequest_1.validateRequest, policyCapitulo_1.policyCapitulo, CapituloController_1.putCapitulo);
router.get('/api/capitulo/:id', isAuth_1.isAuthUser, [
    express_validator_1.param('id')
        .notEmpty()
        .isNumeric()
        .withMessage("El parámetro id es requerido y debe ser entero")
], validateRequest_1.validateRequest, policyCapitulo_1.policyCapitulo, CapituloController_1.getCapitulosById);
router.get('/api/capitulo', isAuth_1.isAuthUser, validateRequest_1.validateRequest, CapituloController_1.getCapitulos);
router.delete('/api/capitulo/:id', isAuth_1.isAuthUser, [
    express_validator_1.param('id')
        .notEmpty()
        .isNumeric()
        .withMessage("El parámetro id es requerido y debe ser entero"),
], validateRequest_1.validateRequest, policyCapitulo_1.policyCapitulo, CapituloController_1.deleteCapitulo);
