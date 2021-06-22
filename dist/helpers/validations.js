"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapituloValidation = exports.UsuarioValidation = exports.DepartamentoValidation = exports.PersonaValidation = void 0;
const express_validator_1 = require("express-validator");
const Usuario_1 = require("../models/Usuario");
class RequestValidation {
}
class PersonaValidation extends RequestValidation {
    constructor() {
        super(...arguments);
        this.validation = [
            express_validator_1.body('nombre')
                .trim()
                .notEmpty()
                .withMessage("Nombre Requerido"),
            express_validator_1.body('primerAp')
                .trim()
                .notEmpty()
                .withMessage("Primer Apellido Requerido"),
            express_validator_1.body('telefono')
                .isLength({
                max: 10, min: 10
            })
        ];
    }
}
exports.PersonaValidation = PersonaValidation;
class DepartamentoValidation extends RequestValidation {
    constructor() {
        super(...arguments);
        this.validation = [
            express_validator_1.body('nombre')
                .notEmpty().withMessage("Campo Requerido")
        ];
    }
}
exports.DepartamentoValidation = DepartamentoValidation;
class UsuarioValidation extends RequestValidation {
    constructor() {
        super(...arguments);
        this.validation = [
            express_validator_1.body("password")
                .trim()
                .isLength({
                min: 8,
                max: 16
            })
                .withMessage("Contraseña Requerida"),
            express_validator_1.body('email')
                .isEmail()
                .withMessage("El Correo Electrónico debe de ser válido")
                .custom((value) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const emailInUse = yield Usuario_1.Usuario.findOne({
                        where: {
                            email: value
                        }
                    });
                    if (emailInUse !== null) {
                        return Promise.reject("El Correo Electrónico ya está en Uso");
                    }
                }
                catch (error) {
                    console.log(error);
                    return Promise.reject("Error del Servidor");
                }
            })),
        ];
    }
}
exports.UsuarioValidation = UsuarioValidation;
class CapituloValidation extends RequestValidation {
    constructor() {
        super(...arguments);
        this.validation = [
            express_validator_1.body("nombre")
                .notEmpty()
                .withMessage("Nombre requerido"),
            express_validator_1.body("tipo")
                .notEmpty()
                .withMessage("Tipo del recurso requerido"),
            express_validator_1.body("file.base64")
                .notEmpty()
                .withMessage("file.base64 requerido"),
            express_validator_1.body("file.fileName")
                .notEmpty()
                .withMessage("file.fileName requerido"),
            express_validator_1.body("file.ext")
                .notEmpty()
                .withMessage("file.ext requerido"),
            express_validator_1.body('idCategoria')
                .notEmpty()
                .isNumeric()
                .withMessage('idCategoria requerido')
        ];
    }
}
exports.CapituloValidation = CapituloValidation;
