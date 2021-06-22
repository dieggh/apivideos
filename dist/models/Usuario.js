"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("./../utils/database");
class Usuario extends sequelize_1.Model {
}
exports.Usuario = Usuario;
Usuario.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    password: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    nivelAcceso: {
        type: new sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    estatus: {
        type: sequelize_1.DataTypes.CHAR(1),
        defaultValue: "1"
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: "Usuario",
    sequelize: database_1.sequelize, // passing the `sequelize` instance is required
});
