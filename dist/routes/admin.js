"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const AdminContoller_1 = require("../controllers/AdminContoller");
const validateRequest_1 = require("../helpers/validateRequest");
const validations_1 = require("../helpers/validations");
const isAuth_1 = require("../middlewares/isAuth");
const policyAdministrador_1 = require("../middlewares/policyAdministrador");
const router = express_1.default.Router();
exports.adminRouter = router;
router.put('/api/admin/:id', isAuth_1.isAuthUser, new validations_1.PersonaValidation().validation, [
    express_validator_1.param('id')
        .notEmpty()
        .isNumeric()
        .withMessage("El parámetro id es requerido y debe ser entero")
], validateRequest_1.validateRequest, policyAdministrador_1.policyAdmin, AdminContoller_1.putAdministrador);
router.get('/api/admin', isAuth_1.isAuthAdmin, AdminContoller_1.getAdministradores);
router.get('/api/admin/:id', isAuth_1.isAuthUser, [
    express_validator_1.param('id')
        .notEmpty()
        .isNumeric()
        .withMessage("El parámetro id es requerido y debe ser entero")
], policyAdministrador_1.policyAdmin, AdminContoller_1.getAdministradorById);
