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
exports.pathEnableCategoria = exports.deleteCategoria = exports.putCategoria = exports.getCategorias = exports.getCategoriaById = exports.postCategoria = void 0;
const Administrador_1 = require("../models/Administrador");
const Categoria_1 = require("../models/Categoria");
const Departamento_Categoria_1 = require("../models/Departamento_Categoria");
const postCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idKind } = req.currentUser;
        const { nombre, descripcion } = req.body;
        const admin = yield Administrador_1.Administrador.findByPk(idKind, { attributes: ["id", "estatus"] });
        if (admin && admin.estatus === '1') {
            const categoria = yield admin.createCategoria({
                nombre: nombre,
                descripcion: descripcion,
                ip: req.ip
            });
            return res.status(200).json({
                status: true,
                categoria: categoria
            });
        }
        else {
            return res.status(404).json({
                status: false,
                message: "Administrador no existe"
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
exports.postCategoria = postCategoria;
const putCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { descripcion } = req.body;
        const { id } = req.params;
        const categoria = yield Categoria_1.Categoria.findByPk(id);
        if (categoria) {
            //categoria.nombre = nombre;
            categoria.descripcion = descripcion;
            yield categoria.save();
            res.status(200).json({
                status: true,
                categoria: categoria
            });
        }
        else {
            res.status(404).json({
                status: false,
                message: "Categoria no existe"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: false
        });
    }
});
exports.putCategoria = putCategoria;
const getCategorias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idKind, nivelAcceso } = req.currentUser;
        if (nivelAcceso === 0) {
            const categorias = yield Categoria_1.Categoria.findAll();
            return res.status(200).json({
                status: true,
                categorias
            });
        }
        const admin = yield Administrador_1.Administrador.findByPk(idKind, { attributes: ["id"] });
        if (admin) {
            const categorias = yield admin.getCategorias();
            res.status(200).json({
                status: true,
                categorias
            });
        }
        else {
            res.status(404).json({
                status: false,
                message: "Administrador no existe"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: false
        });
    }
});
exports.getCategorias = getCategorias;
const getCategoriaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const categoria = yield Categoria_1.Categoria.findByPk(id);
        if (categoria) {
            res.status(200).json({
                status: true,
                categoria
            });
        }
        else {
            res.status(404).json({
                status: false,
                message: "Categoria no existe"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: false
        });
    }
});
exports.getCategoriaById = getCategoriaById;
const deleteCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const categoria = yield Categoria_1.Categoria.findByPk(id);
        if (categoria) {
            categoria.estatus = '0';
            yield categoria.save();
            const asigns = yield Departamento_Categoria_1.Departamento_Categoria.findAll({
                where: {
                    idCategoria: id,
                    estatus: '1'
                }
            });
            for (const asig of asigns) {
                asig.estatus = '0';
                yield asig.save();
            }
            res.status(200).json({
                status: true
            });
        }
        else {
            res.status(404).json({
                status: false,
                message: "Categoría no existe"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: false
        });
    }
});
exports.deleteCategoria = deleteCategoria;
const pathEnableCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const categoria = yield Categoria_1.Categoria.findByPk(id);
        if (categoria) {
            categoria.estatus = '1';
            yield categoria.save();
            const asigns = yield Departamento_Categoria_1.Departamento_Categoria.findAll({
                where: {
                    idCategoria: id,
                    estatus: '0'
                }
            });
            for (const asig of asigns) {
                asig.estatus = '1';
                yield asig.save();
            }
            res.status(200).json({
                status: true
            });
        }
        else {
            res.status(404).json({
                status: false,
                message: "Categoría no existe"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: false
        });
    }
});
exports.pathEnableCategoria = pathEnableCategoria;
