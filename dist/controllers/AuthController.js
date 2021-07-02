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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCheckSesion = exports.postSignInMobile = exports.postSignUpTitular = exports.postMobileRefreshToken = exports.postRefreshToken = exports.postSignUp = exports.postSignIn = void 0;
const Administrador_1 = require("../models/Administrador");
const Persona_1 = require("../models/Persona");
const Usuario_1 = require("../models/Usuario");
const password_1 = require("../utils/password");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Empleado_1 = require("../models/Empleado");
const config_1 = require("../config/config");
const database_1 = require("../utils/database");
const postSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email } = req.body;
        let idkind = null;
        let user;
        const admin = yield Administrador_1.Administrador.findOne({
            attributes: ["id"],
            where: {
                estatus: '1'
            },
            include: {
                model: Usuario_1.Usuario, as: 'usuario',
                attributes: ["email", "password", "nivelAcceso", "id"],
                where: {
                    'email': email
                },
            }
        });
        if (admin !== null) {
            idkind = admin.id;
            user = admin.usuario;
        }
        else {
            return res.status(403).json({
                status: false,
                message: "Usuario o contraseña incorrecta",
            });
        }
        console.log(user);
        if (user !== null) {
            if (!(yield password_1.Password.compare(user.password, password))) {
                return res.status(403).json({
                    status: false,
                    message: "Usuario o contraseña incorrecta",
                    user: null
                });
            }
            const typeUser = user.nivelAcceso === 0 ? "superAdmin" : "admin";
            const token = jsonwebtoken_1.default.sign({ email: user.email, id: user.id, nivelAcceso: user.nivelAcceso, typeUser, idKind: idkind }, config_1.config.KEY_SECRET, { expiresIn: '12h' });
            const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, nivelAcceso: user.nivelAcceso }, config_1.config.KEY_SECRET, { expiresIn: '15 days' });
            user.token = refreshToken;
            yield user.save();
            return res.status(200).json({
                status: true,
                message: "Autenticado Correctamente",
                user: { email: user.email, tipo: typeUser, nivelAcceso: user.nivelAcceso },
                token: token,
                refreshToken: refreshToken
            });
        }
        else {
            res.status(403).json({
                status: false,
                message: "Usuario o contraseña incorrecta",
                user: null
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
exports.postSignIn = postSignIn;
const postSignInMobile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email } = req.body;
        let idkind = null;
        let user;
        const emp = yield Empleado_1.Empleado.findOne({
            attributes: ["id"],
            where: {
                estatus: '1'
            },
            include: {
                model: Usuario_1.Usuario, as: 'usuario',
                attributes: ["email", "password", "nivelAcceso", "id"],
                where: {
                    'email': email
                },
            }
        });
        if (emp === null) {
            return res.status(403).json({
                status: false,
                message: "Usuario o contraseña incorrecta",
            });
        }
        else {
            user = emp.usuario;
            idkind = emp.id;
        }
        if (!(yield password_1.Password.compare(user.password, password))) {
            return res.status(403).json({
                status: false,
                message: "Usuario o contraseña incorrecta",
                user: null
            });
        }
        const typeUser = "empleado";
        const token = jsonwebtoken_1.default.sign({ email: user.email, id: user.id, nivelAcceso: user.nivelAcceso, typeUser, idKind: idkind }, config_1.config.KEY_SECRET, { expiresIn: '12h' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, nivelAcceso: user.nivelAcceso }, config_1.config.KEY_SECRET, { expiresIn: '30 days' });
        user.token = refreshToken;
        yield user.save();
        return res.status(200).json({
            status: true,
            message: "Autenticado Correctamente",
            user: { email: user.email, tipo: typeUser },
            token: token,
            refreshToken: refreshToken
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false
        });
    }
});
exports.postSignInMobile = postSignInMobile;
const postSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield database_1.sequelize.transaction();
    try {
        const { persona: { nombre, primerAp, segundoAp, telefono }, usuario: { email, password, nivelAcceso }, noInterno } = req.body;
        const per = yield Persona_1.Persona.create({
            ip: req.ip,
            nombre,
            primerAp,
            segundoAp,
            telefono
        }, {
            transaction: t
        });
        const admin = yield per.createAdministrador({
            noInterno: noInterno
        }, {
            transaction: t
        });
        const hashedPass = yield password_1.Password.toHash(password);
        const user = yield admin.createUsuario({
            email,
            nivelAcceso: nivelAcceso,
            password: hashedPass,
        }, {
            transaction: t
        });
        const perCreated = per.get({ plain: true });
        const adminCreated = admin.get({ plain: true });
        const userCreated = user.get({ plain: true });
        yield t.commit();
        res.status(200).json({
            status: true,
            admin: Object.assign(Object.assign({ persona: Object.assign({}, perCreated) }, adminCreated), { usuario: Object.assign(Object.assign({}, userCreated), { password: null }) })
        });
    }
    catch (error) {
        yield t.rollback();
        console.log(error);
        res.status(500).json({
            status: false
        });
    }
});
exports.postSignUp = postSignUp;
const postSignUpTitular = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield database_1.sequelize.transaction();
    try {
        const { persona: { nombre, primerAp, segundoAp, telefono }, usuario: { email, password }, noInterno } = req.body;
        console.log("add" + nombre);
        const per = yield Persona_1.Persona.create({
            ip: req.ip,
            nombre,
            primerAp,
            segundoAp,
            telefono
        }, {
            transaction: t
        });
        const admin = yield per.createAdministrador({
            noInterno: noInterno
        }, {
            transaction: t
        });
        const hashedPass = yield password_1.Password.toHash(password);
        yield admin.createUsuario({
            email,
            nivelAcceso: 1,
            password: hashedPass,
        }, {
            transaction: t
        });
        yield t.commit();
        res.status(200).json({
            status: true
        });
    }
    catch (error) {
        yield t.rollback();
        console.log(error);
        res.status(500).json({
            status: false
        });
    }
});
exports.postSignUpTitular = postSignUpTitular;
const postRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.toString();
        const refreshToken = (_b = req.headers["access-token"]) === null || _b === void 0 ? void 0 : _b.toString();
        if (token && refreshToken) {
            const decodedToken = jsonwebtoken_1.default.decode(token.replace("Bearer ", ""));
            if (Date.now() > decodedToken.exp * 1000) {
                const payload = jsonwebtoken_1.default.verify(refreshToken.replace("Bearer ", ""), config_1.config.KEY_SECRET);
                if (payload.id === decodedToken.id) {
                    const user = yield Usuario_1.Usuario.findByPk(payload.id, {
                        attributes: ["email", "id", "nivelAcceso", "estatus", "token"],
                        include: {
                            model: payload.nivelAcceso === 0 ? Administrador_1.Administrador : Empleado_1.Empleado,
                            attributes: ["id"]
                        }
                    });
                    if (user && user.estatus === "1") {
                        if (user.token !== refreshToken.replace("Bearer ", "")) {
                            return res.status(403).send({
                                status: false,
                                message: "Token inválido"
                            });
                        }
                        const typeUser = user.nivelAcceso === 0 ? "superAdmin" : user.nivelAcceso === 1 ? "admin" : "empleado";
                        const token = jsonwebtoken_1.default.sign({ email: user.email, id: user.id, nivelAcceso: user.nivelAcceso, typeUser, idKind: user.Empleado ? user.id : (_c = user.Administrador) === null || _c === void 0 ? void 0 : _c.id }, config_1.config.KEY_SECRET, { expiresIn: '12h' });
                        const newRefreshToken = jsonwebtoken_1.default.sign({ id: user.id, nivelAcceso: user.nivelAcceso }, config_1.config.KEY_SECRET, { expiresIn: '30 days' });
                        user.token = newRefreshToken;
                        yield user.save();
                        return res.status(200).send({
                            status: true,
                            token: token,
                            refreshToken: newRefreshToken
                        });
                    }
                    else {
                        res.status(403).json({
                            status: false,
                            message: "Usuario no Autorizado"
                        });
                    }
                }
                else {
                    res.status(403).json({
                        status: false,
                        message: "Token Inválido"
                    });
                }
            }
            else {
                res.status(200).json({
                    status: false,
                    message: "Token no expirado"
                });
            }
        }
        else {
            res.status(403).json({
                status: false,
                message: "Token no proveido"
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            sentToLogin: true
        });
    }
});
exports.postRefreshToken = postRefreshToken;
const postMobileRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    try {
        const token = (_d = req.headers.authorization) === null || _d === void 0 ? void 0 : _d.toString();
        const refreshToken = (_e = req.headers["access-token"]) === null || _e === void 0 ? void 0 : _e.toString();
        if (token && refreshToken) {
            const decodedToken = jsonwebtoken_1.default.decode(token.replace("Bearer ", ""));
            if (Date.now() > decodedToken.exp * 1000) {
                const payload = jsonwebtoken_1.default.verify(refreshToken.replace("Bearer ", ""), config_1.config.KEY_SECRET);
                if (payload.id === decodedToken.id) {
                    const user = yield Usuario_1.Usuario.findByPk(payload.id, {
                        attributes: ["email", "id", "nivelAcceso", "estatus", "token"],
                        include: {
                            model: Empleado_1.Empleado,
                            attributes: ["id"]
                        }
                    });
                    if (user && user.estatus === "1") {
                        if (user.token !== refreshToken.replace("Bearer ", "")) {
                            return res.status(403).send({
                                status: false,
                                message: "Token inválido"
                            });
                        }
                        const typeUser = "empleado";
                        const token = jsonwebtoken_1.default.sign({ email: user.email, id: user.id, nivelAcceso: 2, typeUser, idKind: (_f = user.Empleado) === null || _f === void 0 ? void 0 : _f.id }, config_1.config.KEY_SECRET, { expiresIn: '12h' });
                        const newRefreshToken = jsonwebtoken_1.default.sign({ id: user.id, nivelAcceso: 2 }, config_1.config.KEY_SECRET, { expiresIn: '30 days' });
                        user.token = newRefreshToken;
                        yield user.save();
                        return res.status(200).send({
                            status: true,
                            token: token,
                            refreshToken: newRefreshToken
                        });
                    }
                    else {
                        res.status(403).json({
                            status: false,
                            message: "Usuario no Autorizado"
                        });
                    }
                }
                else {
                    res.status(403).json({
                        status: false,
                        message: "Token Inválido"
                    });
                }
            }
            else {
                res.status(200).json({
                    status: false,
                    message: "Token no expirado"
                });
            }
        }
        else {
            res.status(403).json({
                status: false,
                message: "Token no proveido"
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            sentToLogin: true
        });
    }
});
exports.postMobileRefreshToken = postMobileRefreshToken;
const postCheckSesion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idKind, nivelAcceso, email, id } = req.currentUser;
        const typeUser = nivelAcceso === 0 ? "superAdmin" : "admin";
        const token = jsonwebtoken_1.default.sign({ email: email, id: id, nivelAcceso: nivelAcceso, typeUser, idKind: idKind }, config_1.config.KEY_SECRET, { expiresIn: '8h' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: id, nivelAcceso: nivelAcceso }, config_1.config.KEY_SECRET, { expiresIn: '15 days' });
        const user = yield Usuario_1.Usuario.findByPk(id);
        if (user && user.estatus === '1') {
            user.token = refreshToken;
            yield user.save();
            return res.status(200).json({
                status: true,
                message: "Autenticado Correctamente",
                user: { email: user.email, tipo: typeUser, nivelAcceso: user.nivelAcceso },
                token: token,
                refreshToken: refreshToken
            });
        }
        else {
            return res.status(404).json({
                status: false,
                message: 'Usuario no Existe'
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: false,
        });
    }
});
exports.postCheckSesion = postCheckSesion;
