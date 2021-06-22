"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstadoModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("./../utils/database");
const EstadoModel = database_1.sequelize.define("Estado", {
    id: {
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    timestamps: false,
    freezeTableName: true
});
exports.EstadoModel = EstadoModel;
