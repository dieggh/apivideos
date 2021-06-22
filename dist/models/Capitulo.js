"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Capitulo = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../utils/database");
class Capitulo extends sequelize_1.Model {
}
exports.Capitulo = Capitulo;
Capitulo.init({
    id: {
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
    },
    descripcion: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    tipo: {
        type: sequelize_1.DataTypes.STRING,
        comment: "video, other"
    },
    path: {
        type: sequelize_1.DataTypes.STRING,
    },
    duracion: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    estatus: {
        type: sequelize_1.DataTypes.CHAR(1),
        defaultValue: '1'
    },
    ip: {
        type: sequelize_1.DataTypes.STRING(60)
    }
}, {
    tableName: "Capitulo",
    sequelize: database_1.sequelize
});
