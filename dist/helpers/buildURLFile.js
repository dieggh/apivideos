"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildURL = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const buildURL = (capitulos, id, nivelAcceso) => {
    const token = jsonwebtoken_1.default.sign({
        idKind: id, nivelAcceso
    }, config_1.config.KEY_FILES, {
        expiresIn: '7h'
    });
    for (const cap of capitulos) {
        cap.path = `${process.env.SERVE_FILES}/files/${token}/${cap.id}/${cap.path.replace('dist/public/', '')}`;
    }
};
exports.buildURL = buildURL;
