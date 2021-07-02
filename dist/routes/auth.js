"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../controllers/AuthController");
const validateRequest_1 = require("../helpers/validateRequest");
const validations_1 = require("../helpers/validations");
const isAuth_1 = require("../middlewares/isAuth");
const cors_1 = __importDefault(require("cors"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
exports.authRoute = router;
router.post('/api/auth/mobile/signin', cors_1.default(), [
    express_validator_1.body("password")
        .trim()
        .isLength({
        min: 6,
        max: 16
    })
        .withMessage("Contraseña Requerida"),
    express_validator_1.body("email")
        .isEmpty().withMessage("Correo Electrónico requerido")
        .isEmail()
        .withMessage("Correo Electrónico no válido"),
], validateRequest_1.validateRequest, AuthController_1.postSignInMobile);
router.post('/api/auth/mobile/refreshToken', cors_1.default(), AuthController_1.postMobileRefreshToken);
router.post('/api/auth/signin', [
    express_validator_1.body("password")
        .trim()
        .isLength({
        min: 6,
        max: 16
    })
        .withMessage("Contraseña Requerida"),
    express_validator_1.body("email")
        .notEmpty().withMessage("Correo Electrónico requerido")
        .isEmail().withMessage("Correo Electrónico no válido"),
], validateRequest_1.validateRequest, AuthController_1.postSignIn);
router.post('/api/auth/refreshToken', AuthController_1.postRefreshToken);
router.get('/api/auth/check', isAuth_1.verifyToken, AuthController_1.postCheckSesion);
router.post('/api/admin/signup', isAuth_1.isAuthAdmin, new validations_1.PersonaValidation().validation, new validations_1.UsuarioValidation().validation, validateRequest_1.validateRequest, AuthController_1.postSignUp);
router.post('/api/admin/signupTitular', isAuth_1.isAuthAdmin, new validations_1.PersonaValidation().validation, new validations_1.UsuarioValidation().validation, validateRequest_1.validateRequest, AuthController_1.postSignUpTitular);
