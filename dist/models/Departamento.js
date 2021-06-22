"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Departamento = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("./../utils/database");
class Departamento extends sequelize_1.Model {
}
exports.Departamento = Departamento;
Departamento.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    descripcion: {
        type: new sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    estatus: {
        type: new sequelize_1.DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: '1'
    },
    ip: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "Departamento",
    sequelize: database_1.sequelize
});
