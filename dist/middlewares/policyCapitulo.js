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
exports.policyFiles = exports.policyEmpleadoCapitulo = exports.policyCapitulo = void 0;
const Administrador_1 = require("../models/Administrador");
const Capitulo_1 = require("../models/Capitulo");
const Categoria_1 = require("../models/Categoria");
const Departamento_1 = require("../models/Departamento");
const Empleado_1 = require("../models/Empleado");
const policyCapitulo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { idKind, nivelAcceso } = req.currentUser;
        const admin = yield Administrador_1.Administrador.findByPk(idKind, { attributes: ["id", "estatus"] });
        if (admin) {
            if (admin.estatus !== '1') {
                return res.status(403).json({
                    status: false,
                    message: "Acceso denegado"
                });
            }
            if (nivelAcceso === 0) {
                return next();
            }
            const cap = yield Capitulo_1.Capitulo.findByPk(id, {
                include: {
                    model: Categoria_1.Categoria, as: 'categoria',
                    where: {
                        idAdministrador: idKind
                    }
                }
            });
            if (cap) {
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
                message: "Administrador no encontrado"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: false
        });
    }
});
exports.policyCapitulo = policyCapitulo;
const policyEmpleadoCapitulo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { idKind, nivelAcceso } = req.currentUser;
        const { idCapitulo } = req.body;
        const { id } = req.params;
        if (nivelAcceso === 0 && req.path.includes('videos')) {
            return next();
        }
        const hasRight = yield Capitulo_1.Capitulo.findOne({
            attributes: ["id"],
            where: {
                id: idCapitulo ? idCapitulo : id
            },
            include: [
                {
                    model: Categoria_1.Categoria, as: 'categoria',
                    attributes: ["id"],
                    include: [
                        {
                            model: Departamento_1.Departamento,
                            attributes: ["id"],
                            through: {
                                attributes: ["idDepartamento", "idCategoria"]
                            },
                            include: [
                                {
                                    model: Empleado_1.Empleado, as: 'Empleados',
                                    through: {
                                        attributes: ["idDepartamento", "idEmpleado"]
                                    },
                                    where: {
                                        id: idKind
                                    },
                                    attributes: ["id"]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        if (hasRight) {
            if ((_a = hasRight.categoria) === null || _a === void 0 ? void 0 : _a.Departamentos) {
                if (((_b = hasRight.categoria) === null || _b === void 0 ? void 0 : _b.Departamentos.length) > 0) {
                    if (hasRight.categoria.Departamentos[0].Empleados.length > 0) {
                        return next();
                    }
                }
            }
            return res.status(403).json({
                status: false,
                message: "Acceso denegado"
            });
        }
        else {
            res.status(403).json({
                status: false,
                message: "Acceso denegado"
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false
        });
    }
});
exports.policyEmpleadoCapitulo = policyEmpleadoCapitulo;
const policyFiles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idKind, nivelAcceso } = req.filesToken;
        const { idCapitulo } = req.body;
        const { id } = req.params;
        if (nivelAcceso === 0) {
            return next();
        }
        const hasRight = yield Capitulo_1.Capitulo.findOne({
            attributes: ["id"],
            where: {
                id: idCapitulo ? idCapitulo : id
            },
            include: [
                {
                    model: Categoria_1.Categoria, as: 'categoria',
                    where: {
                        idAdministrador: idKind
                    }
                }
            ]
        });
        if (hasRight) {
            if (hasRight.categoria) {
                return next();
            }
            return res.status(403).json({
                status: false,
                message: "Acceso denegado"
            });
        }
        else {
            res.status(403).json({
                status: false,
                message: "Acceso denegado"
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false
        });
    }
});
exports.policyFiles = policyFiles;
