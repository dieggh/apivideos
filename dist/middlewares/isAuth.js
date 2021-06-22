"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthEmployer = exports.isAuthUser = exports.isAuthAdmin = void 0;
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
            res.status(401).json({
                message: "Permisos Insuficientes",
                status: false
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(401).json({
            message: "Token no Proveído",
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
            return res.status(401).json({
                message: "Permisos Insuficientes",
                status: false
            });
        }
    }
    catch (error) {
        res.status(401).json({
            message: error,
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
            res.status(401).json({
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
            throw "Token no Proveído";
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
