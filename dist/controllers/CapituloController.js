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
exports.deleteCapitulo = exports.putCapitulo = exports.getCapitulosById = exports.getCapitulos = exports.postCapitulo = void 0;
const Capitulo_1 = require("../models/Capitulo");
const Categoria_1 = require("../models/Categoria");
const base64_1 = require("../utils/base64");
const postCapitulo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, descripcion, tipo, duracion, idCategoria, file } = req.body;
        const categoria = yield Categoria_1.Categoria.findByPk(idCategoria, {
            attributes: ["id"]
        });
        if (categoria) {
            const cap = yield categoria.createCapitulo({
                nombre: nombre,
                descripcion: descripcion,
                tipo: tipo,
                path: 'somepath',
                duracion: duracion,
                ip: req.ip
            });
            const directory = `${process.env.FILES_PATH}/videos/${cap.id}`;
            const path = yield base64_1.saveFiles(file.base64, file.fileName, file.ext, directory);
            if (path) {
                cap.path = path;
                yield cap.save();
            }
            res.status(200).json({
                status: true
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
        console.log(error);
        res.status(500).json({
            status: false
        });
    }
});
exports.postCapitulo = postCapitulo;
const putCapitulo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, descripcion, tipo, duracion, idCategoria, file } = req.body;
        const { id } = req.params;
        const cap = yield Capitulo_1.Capitulo.findByPk(id);
        if (cap) {
            if (idCategoria) {
                const categoria = yield Categoria_1.Categoria.findByPk(idCategoria);
                if (categoria) {
                    yield cap.setCategoria(categoria);
                    //console.log(cap2)
                }
                else {
                    return res.status(404).json({
                        status: false,
                        message: "Categoria no Existe"
                    });
                }
            }
            cap.nombre = nombre;
            cap.descripcion = descripcion;
            cap.tipo = tipo;
            cap.duracion = duracion;
            if (file) {
                const directory = `${process.env.FILES_PATH}/videos/${cap.id}`;
                const path = yield base64_1.saveFiles(file.base64, file.fileName, file.ext, directory, cap.path);
                if (path) {
                    cap.path = path;
                }
            }
            yield cap.save();
            res.status(200).json({
                status: true
            });
        }
        else {
            res.status(404).json({
                status: false,
                message: "Capitulo no existe"
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
exports.putCapitulo = putCapitulo;
const getCapitulos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idKind, nivelAcceso } = req.currentUser;
        if (nivelAcceso === 0) {
            const capitulos = yield Capitulo_1.Capitulo.findAll({
                include: {
                    model: Categoria_1.Categoria, as: 'categoria',
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "ip"]
                    }
                }
            });
            return res.status(200).json({
                status: true,
                capitulos
            });
        }
        else {
            const capitulos = yield Capitulo_1.Capitulo.findAll({
                include: {
                    model: Categoria_1.Categoria, as: 'categoria',
                    where: {
                        idAdministrador: idKind
                    }
                }
            });
            res.status(200).json({
                status: true,
                capitulos
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: false
        });
    }
});
exports.getCapitulos = getCapitulos;
const getCapitulosById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const capitulo = yield Capitulo_1.Capitulo.findByPk(id, {
            include: {
                model: Categoria_1.Categoria, as: 'categoria',
                attributes: {
                    exclude: ["createdAt", "updatedAt", "ip"]
                }
            }
        });
        if (capitulo) {
            res.status(200).json({
                status: true,
                capitulo
            });
        }
        else {
            res.status(404).json({
                status: false,
                message: "Capitulo no existe"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: false
        });
    }
});
exports.getCapitulosById = getCapitulosById;
const deleteCapitulo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const capitulo = yield Capitulo_1.Capitulo.findByPk(id);
        if (capitulo) {
            capitulo.estatus = '0';
            yield capitulo.save();
            res.status(200).json({
                status: true
            });
        }
        else {
            res.status(404).json({
                status: false,
                message: "Capítulo no existe"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: false
        });
    }
});
exports.deleteCapitulo = deleteCapitulo;
