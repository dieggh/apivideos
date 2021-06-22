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
exports.deleteDepartamento = exports.putDepartamento = exports.getDepartamentoById = exports.postDepartamento = exports.getDepartamento = void 0;
const Administrador_1 = require("../models/Administrador");
const Departamento_1 = require("../models/Departamento");
const Departamento_Categoria_1 = require("../models/Departamento_Categoria");
const postDepartamento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, descripcion, categorias } = req.body;
        const { idKind } = req.currentUser;
        const admin = yield Administrador_1.Administrador.findByPk(idKind, { attributes: ["id", "estatus"] });
        if (admin && admin.estatus === '1') {
            const departamento = yield admin.createDepartamento({
                nombre,
                descripcion,
                ip: req.ip
            });
            if (categorias) {
                for (const categoria of categorias) {
                    yield Departamento_Categoria_1.Departamento_Categoria.create({
                        idDepartamento: departamento.id,
                        idCategoria: categoria.id,
                        ip: req.ip
                    });
                }
            }
            return res.status(200).json({
                status: true
            });
        }
        res.status(404).json({
            status: false,
            message: "El administrador no existe"
        });
    }
    catch (error) {
        res.status(500).json({
            status: false
        });
    }
});
exports.postDepartamento = postDepartamento;
const getDepartamento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idKind, nivelAcceso } = req.currentUser;
        if (nivelAcceso === 0) {
            const departamentos = yield Departamento_1.Departamento.findAll();
            return res.status(200).json({
                status: true,
                departamentos
            });
        }
        else {
            const admin = yield Administrador_1.Administrador.findByPk(idKind);
            if (admin) {
                const departamentos = yield admin.getDepartamentos();
                return res.status(200).json({
                    status: true,
                    departamentos
                });
            }
            else {
                return res.status(404).json({
                    status: false,
                    message: "El administrador no existe"
                });
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false
        });
    }
});
exports.getDepartamento = getDepartamento;
const getDepartamentoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const departamento = yield Departamento_1.Departamento.findByPk(id);
        if (departamento) {
            res.status(200).json({
                status: true,
                departamento: departamento
            });
        }
        else {
            res.status(404).json({
                status: false,
                message: "Departamento no existe"
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
exports.getDepartamentoById = getDepartamentoById;
const putDepartamento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { nombre, descripcion, categorias } = req.body;
        const departamento = yield Departamento_1.Departamento.findByPk(id);
        if (departamento) {
            departamento.nombre = nombre;
            departamento.descripcion = descripcion;
            yield departamento.save();
            if (categorias) {
                for (const categoria of categorias) {
                    const cat = yield Departamento_Categoria_1.Departamento_Categoria.findOne({
                        where: {
                            idCategoria: categoria.id,
                            idDepartamento: departamento.id
                        }
                    });
                    if (categoria.estatus === '1') {
                        if (!cat) {
                            yield Departamento_Categoria_1.Departamento_Categoria.create({
                                idDepartamento: departamento.id,
                                idCategoria: categoria.id,
                                ip: req.ip
                            });
                        }
                    }
                    else {
                        if (cat) {
                            cat.estatus = '0';
                            yield cat.save();
                        }
                    }
                }
            }
            return res.status(200).json({
                status: true
            });
        }
        res.status(404).json({
            status: false,
            message: "Departamento no Existe"
        });
    }
    catch (error) {
        res.status(500).json({
            status: false
        });
    }
});
exports.putDepartamento = putDepartamento;
const deleteDepartamento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const departamento = yield Departamento_1.Departamento.findByPk(id);
        if (departamento) {
            departamento.estatus = '0';
            yield departamento.save();
            return res.status(200).json({
                status: true
            });
        }
        return res.status(404).json({
            status: false,
            message: "Departamento no Existe"
        });
    }
    catch (error) {
        res.status(500).json({
            status: false
        });
    }
});
exports.deleteDepartamento = deleteDepartamento;
