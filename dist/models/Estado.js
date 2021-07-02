"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Estado = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("./../utils/database");
class Estado extends sequelize_1.Model {
}
exports.Estado = Estado;
Estado.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: new sequelize_1.DataTypes.STRING(128),
    }
}, {
    tableName: "Estado",
    timestamps: false,
    sequelize: database_1.sequelize, // passing the `sequelize` instance is required
});
