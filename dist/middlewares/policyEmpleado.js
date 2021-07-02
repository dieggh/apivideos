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
exports.policyEmpleado = void 0;
const Administrador_1 = require("../models/Administrador");
const Empleado_1 = require("../models/Empleado");
const policyEmpleado = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { idKind, nivelAcceso } = req.currentUser;
        const emp = yield Empleado_1.Empleado.findByPk(id ? id : idKind, {
            attributes: ["idAdministrador", "id"],
            include: {
                model: Administrador_1.Administrador, as: 'administrador',
                attributes: ["id", "estatus"]
            }
        });
        if (emp) {
            if (((_a = emp.administrador) === null || _a === void 0 ? void 0 : _a.estatus) === '0') {
                return res.status(403).json({
                    status: false,
                    message: "Acceso Denegado"
                });
            }
            if (nivelAcceso === 0) {
                return next();
            }
            console.log(idKind);
            console.log(emp.id);
            if (emp.idAdministrador === idKind || emp.id === idKind) {
                next();
            }
            else {
                res.status(403).json({
                    status: false,
                    message: "Acceso no Autorizado"
                });
            }
        }
        else {
            res.status(404).json({
                status: false,
                message: "Empleado no encontrado"
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(404).json({
            status: false
        });
    }
});
exports.policyEmpleado = policyEmpleado;
