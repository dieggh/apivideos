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
exports.policyAdmin = void 0;
const Administrador_1 = require("../models/Administrador");
const policyAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { idKind, nivelAcceso } = req.currentUser;
        const admin = yield Administrador_1.Administrador.findByPk(idKind, { attributes: ["id", "estatus"] });
        if (admin && admin.estatus === "1") {
            if (nivelAcceso === 0) {
                return next();
            }
            if (parseInt(id) === idKind) {
                next();
            }
            else {
                res.status(403).json({
                    status: false,
                    message: "Acceso Denegado"
                });
            }
        }
        else {
            res.status(404).json({
                status: false,
                message: "Administrador no existe s"
            });
        }
    }
    catch (error) {
        res.status(404).json({
            status: false
        });
    }
});
exports.policyAdmin = policyAdmin;
