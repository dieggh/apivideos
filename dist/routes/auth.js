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
const router = express_1.default.Router();
exports.authRoute = router;
router.post('/api/auth/mobile/signin', cors_1.default(), new validations_1.UsuarioValidation().validation, AuthController_1.postSignInMobile);
router.post('/api/auth/signin', new validations_1.UsuarioValidation().validation, AuthController_1.postSignIn);
router.post('/api/auth/refreshToken', AuthController_1.postRefreshToken);
router.post('/api/admin/signup', isAuth_1.isAuthAdmin, new validations_1.PersonaValidation().validation, new validations_1.UsuarioValidation().validation, validateRequest_1.validateRequest, AuthController_1.postSignUp);
router.post('/api/admin/signupTitular', isAuth_1.isAuthAdmin, new validations_1.PersonaValidation().validation, new validations_1.UsuarioValidation().validation, validateRequest_1.validateRequest, AuthController_1.postSignUpTitular);
