"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenFiles = exports.verifyToken = exports.isAuthEmployer = exports.isAuthUser = exports.isAuthAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const isAuthAdmin = (req, res, next) => {
    try {
        const payload = isAuth(req, res);
        if (payload.nivelAcceso === 0) {
            req.currentUser = payload;
            next();
        }
        else {
            res.status(403).json({
                message: "Permisos Insuficientes",
                status: false
            });
        }
    }
    catch (error) {
        res.status(401).json({
            message: error.message,
            status: false
        });
    }
};
exports.isAuthAdmin = isAuthAdmin;
const isAuthUser = (req, res, next) => {
    try {
        const payload = isAuth(req, res);
        if (payload.nivelAcceso < 2) {
            req.currentUser = payload;
            next();
        }
        else {
            return res.status(403).json({
                message: "Permisos Insuficientes",
                status: false
            });
        }
    }
    catch (error) {
        res.status(401).json({
            message: error.message,
            status: false
        });
    }
};
exports.isAuthUser = isAuthUser;
const isAuthEmployer = (req, res, next) => {
    try {
        const payload = isAuth(req, res);
        if (payload.nivelAcceso === 2) {
            req.currentUser = payload;
            next();
        }
        else {
            res.status(403).json({
                message: "Permisos Insuficientes",
                status: false
            });
        }
    }
    catch (error) {
        res.status(401).json({
            message: "Token no Proveído",
            status: false
        });
    }
};
exports.isAuthEmployer = isAuthEmployer;
const isAuth = (req, res) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.toString();
        if (token) {
            const payload = jsonwebtoken_1.default.verify(token.replace('Bearer ', ''), config_1.config.KEY_SECRET);
            return payload;
        }
        else {
            throw new Error("Token no Proveído");
        }
    }
    catch (error) {
        throw error;
    }
};
const verifyToken = (req, res, next) => {
    try {
        const payload = isAuth(req, res);
        if (payload) {
            req.currentUser = payload;
            next();
        }
    }
    catch (error) {
        res.status(401).json({
            message: error.message,
            status: false
        });
    }
};
exports.verifyToken = verifyToken;
const verifyTokenFiles = (req, res, next) => {
    try {
        const { token } = req.params;
        const payload = jsonwebtoken_1.default.verify(token, config_1.config.KEY_FILES);
        if (payload) {
            req.filesToken = payload;
            next();
        }
    }
    catch (error) {
        res.status(401).json({
            message: error.message,
            status: false
        });
    }
};
exports.verifyTokenFiles = verifyTokenFiles;
