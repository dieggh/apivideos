"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Persona = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("./../utils/database");
class Persona extends sequelize_1.Model {
}
exports.Persona = Persona;
Persona.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    primerAp: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    segundoAp: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    telefono: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true
    },
    ip: {
        type: sequelize_1.DataTypes.STRING(54)
    }
}, {
    tableName: "Persona",
    sequelize: database_1.sequelize, // passing the `sequelize` instance is required
});
