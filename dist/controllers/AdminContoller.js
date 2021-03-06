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
exports.getAdministradorPerfil = exports.patchEnableAdministrador = exports.deleteAdministrador = exports.getAdministradorById = exports.getAdministradores = exports.putAdministrador = void 0;
const Administrador_1 = require("../models/Administrador");
const Persona_1 = require("../models/Persona");
const Usuario_1 = require("../models/Usuario");
const database_1 = require("../utils/database");
const password_1 = require("../utils/password");
const putAdministrador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield database_1.sequelize.transaction();
    try {
        const { id } = req.params;
        const { noInterno, persona: { telefono, segundoAp }, usuario: { password, email } } = req.body;
        const admin = yield Administrador_1.Administrador.findByPk(id, { transaction: t });
        if (admin) {
            admin.noInterno = noInterno;
            const userUpdated = {
                id: 0,
                email: email
            };
            if (password || email) {
                const user = yield admin.getUsuario();
                if (password && password.trim().length > 5) {
                    user.password = yield password_1.Password.toHash(password);
                    user.token = null;
                }
                else if (password) {
                    yield t.rollback();
                    return res.status(400).json({
                        status: false,
                        message: "La contrase??a debe de tener al menos 8 car??cteres"
                    });
                }
                if (email && (email !== user.email)) {
                    if (!(/.+@.+..+/).test(email)) {
                        yield t.rollback();
                        return res.status(400).json({
                            status: false,
                            message: "Correo electr??nico inv??lido"
                        });
                    }
                    const inUse = yield Usuario_1.Usuario.findOne({
                        where: {
                            email: email
                        }
                    });
                    if (!inUse) {
                        user.email = email;
                    }
                    else {
                        yield t.rollback();
                        return res.status(400).json({
                            status: false,
                            message: "El Correo Electr??nico ya est?? en Uso"
                        });
                    }
                }
                yield user.save({ transaction: t });
                userUpdated.email = user.email;
                userUpdated.id = user.id;
            }
            const persona = yield admin.getPersona({ transaction: t });
            persona.telefono = telefono;
            persona.segundoAp = segundoAp;
            yield admin.save({ transaction: t });
            yield persona.save({ transaction: t });
            yield t.commit();
            return res.status(200).json({
                status: true
            });
        }
        res.status(400).json({
            status: false,
            message: "Administrador no existe"
        });
    }
    catch (error) {
        yield t.rollback();
        res.status(500).json({
            status: false
        });
    }
});
exports.putAdministrador = putAdministrador;
const patchEnableAdministrador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const admin = yield Administrador_1.Administrador.findByPk(id);
        if (admin) {
            admin.estatus = '1';
            yield admin.save();
            return res.status(200).json({
                status: true
            });
        }
        res.status(400).json({
            status: false,
            message: "Administrador no existe"
        });
    }
    catch (error) {
        res.status(500).json({
            status: false
        });
    }
});
exports.patchEnableAdministrador = patchEnableAdministrador;
const getAdministradores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nivelAcceso } = req.currentUser;
        if (nivelAcceso === 0) {
            const admin = yield Administrador_1.Administrador.findAll({
                include: [
                    {
                        model: Persona_1.Persona, as: 'persona'
                    },
                    {
                        model: Usuario_1.Usuario, as: 'usuario',
                        attributes: {
                            exclude: ["password", "token"]
                        }
                    }
                ]
            });
            setTimeout(() => {
                res.status(200).json({
                    status: true,
                    administradores: admin
                });
            }, 2000);
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
exports.getAdministradores = getAdministradores;
const getAdministradorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const admin = yield Administrador_1.Administrador.findByPk(id, {
            include: [
                {
                    model: Persona_1.Persona, as: 'persona'
                },
                {
                    model: Usuario_1.Usuario, as: 'usuario',
                    attributes: {
                        exclude: ["password", "token"]
                    }
                }
            ]
        });
        if (admin) {
            return res.status(200).json({
                status: true,
                administrador: admin
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
        res.status(500).json({
            status: false
        });
    }
});
exports.getAdministradorById = getAdministradorById;
const deleteAdministrador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const admin = yield Administrador_1.Administrador.findByPk(id);
        if (admin) {
            admin.estatus = '0';
            const user = yield admin.getUsuario();
            user.token = null;
            yield user.save();
            yield admin.save();
            res.status(200).json({
                status: true
            });
        }
        else {
            res.status(403).json({
                status: true
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: false
        });
    }
});
exports.deleteAdministrador = deleteAdministrador;
const getAdministradorPerfil = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idKind } = req.currentUser;
        const admin = yield Administrador_1.Administrador.findByPk(idKind, {
            include: [
                {
                    model: Persona_1.Persona, as: 'persona',
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "ip"]
                    }
                },
                {
                    model: Usuario_1.Usuario, as: 'usuario',
                    attributes: {
                        exclude: ["password", "token"]
                    }
                }
            ]
        });
        if (admin) {
            if (admin.estatus === '0') {
                admin.usuario.token = null;
                yield admin.save();
                return res.status(401).json({
                    status: false
                });
            }
            return res.status(200).json({
                status: true,
                administrador: admin
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
        res.status(500).json({
            status: false
        });
    }
});
exports.getAdministradorPerfil = getAdministradorPerfil;
