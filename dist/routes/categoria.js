"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriaRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const CategoriaController_1 = require("../controllers/CategoriaController");
const validateRequest_1 = require("../helpers/validateRequest");
const isAuth_1 = require("../middlewares/isAuth");
const policyCategoria_1 = require("../middlewares/policyCategoria");
const router = express_1.Router();
exports.categoriaRouter = router;
router.post('/api/categoria', isAuth_1.isAuthUser, [
    express_validator_1.body('nombre')
        .notEmpty()
        .withMessage("Nombre es Requerido")
], validateRequest_1.validateRequest, CategoriaController_1.postCategoria);
router.put('/api/categoria/:id', isAuth_1.isAuthUser, [
    express_validator_1.param('id')
        .notEmpty()
        .isNumeric()
        .withMessage("El parámetro id es requerido y debe ser entero"),
    express_validator_1.body('nombre')
        .notEmpty()
        .withMessage("Nombre es Requerido")
], validateRequest_1.validateRequest, policyCategoria_1.policyCategoria, CategoriaController_1.putCategoria);
router.get('/api/categoria/:id', isAuth_1.isAuthUser, [
    express_validator_1.param('id')
        .notEmpty()
        .isNumeric()
        .withMessage("El parámetro id es requerido y debe ser entero")
], validateRequest_1.validateRequest, policyCategoria_1.policyCategoria, CategoriaController_1.getCategoriaById);
router.get('/api/categoria', isAuth_1.isAuthUser, validateRequest_1.validateRequest, CategoriaController_1.getCategorias);
router.delete('/api/categoria/:id', isAuth_1.isAuthUser, [
    express_validator_1.param('id')
        .notEmpty()
        .isNumeric()
        .withMessage("El parámetro id es requerido y debe ser entero"),
], validateRequest_1.validateRequest, policyCategoria_1.policyCategoria, CategoriaController_1.deleteCategoria);
