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
exports.deleteDepartamentoEmpleadoAsignacion = exports.patchEnableDepartamento = exports.getDepartamentoEmpleados = exports.getDepartamentoCategorias = exports.deleteDepartamento = exports.putDepartamento = exports.getDepartamentoById = exports.postDepartamento = exports.getDepartamento = void 0;
const Administrador_1 = require("../models/Administrador");
const Categoria_1 = require("../models/Categoria");
const Departamento_1 = require("../models/Departamento");
const Departamento_Categoria_1 = require("../models/Departamento_Categoria");
const Departamento_Empleado_1 = require("../models/Departamento_Empleado");
const Empleado_1 = require("../models/Empleado");
const Persona_1 = require("../models/Persona");
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
                status: true,
                departamento
            });
        }
        res.status(404).json({
            status: false,
            message: "El administrador no existe"
        });
    }
    catch (error) {
        console.log(error);
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
const getDepartamentoCategorias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const categorias = yield Categoria_1.Categoria.findAll({
            where: {
                estatus: '1'
            },
            attributes: ["id", "nombre"],
            include: {
                model: Departamento_1.Departamento,
                attributes: ['id'],
                where: {
                    id: id
                },
                through: {
                    attributes: [],
                    where: {
                        estatus: '1'
                    }
                }
            }
        });
        return res.status(200).json({
            status: true,
            categorias
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false
        });
    }
});
exports.getDepartamentoCategorias = getDepartamentoCategorias;
const getDepartamentoEmpleados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const empleados = yield Empleado_1.Empleado.findAll({
            where: {
                estatus: '1'
            },
            attributes: ["id", "noInterno"],
            include: [
                {
                    model: Departamento_1.Departamento,
                    as: 'Departamento',
                    attributes: ['id'],
                    where: {
                        id: id
                    },
                    through: {
                        attributes: ["id"],
                        where: {
                            estatus: '1'
                        }
                    }
                },
                {
                    model: Persona_1.Persona, as: 'persona',
                    attributes: ["nombre", "primerAp", "segundoAp"]
                }
            ]
        });
        return res.status(200).json({
            status: true,
            empleados
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false
        });
    }
});
exports.getDepartamentoEmpleados = getDepartamentoEmpleados;
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
                const catDepar = yield Departamento_Categoria_1.Departamento_Categoria.findAll({
                    where: {
                        idDepartamento: id
                    }
                });
                for (const categoria of catDepar) {
                    const exits = categorias.find((x) => x.id === categoria.idCategoria);
                    if (exits === undefined) {
                        categoria.estatus = '0';
                        yield categoria.save();
                    }
                }
                for (const categoria of categorias) {
                    const exits = catDepar.find((x) => x.idCategoria === categoria.id);
                    if (exits === undefined) {
                        yield Departamento_Categoria_1.Departamento_Categoria.create({
                            idDepartamento: departamento.id,
                            idCategoria: categoria.id,
                            ip: req.ip
                        });
                    }
                }
            }
            return res.status(200).json({
                status: true,
                departamento
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
const deleteDepartamentoEmpleadoAsignacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const departamentoEmpleado = yield Departamento_Empleado_1.Departamento_Empleado.findByPk(id);
        if (departamentoEmpleado) {
            departamentoEmpleado.estatus = '0';
            yield departamentoEmpleado.save();
        }
        return res.status(200).json({
            status: true,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false
        });
    }
});
exports.deleteDepartamentoEmpleadoAsignacion = deleteDepartamentoEmpleadoAsignacion;
const patchEnableDepartamento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const departamento = yield Departamento_1.Departamento.findByPk(id);
        if (departamento) {
            departamento.estatus = '1';
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
exports.patchEnableDepartamento = patchEnableDepartamento;
