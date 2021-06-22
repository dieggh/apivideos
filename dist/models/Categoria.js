"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categoria = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../utils/database");
const Capitulo_1 = require("./Capitulo");
class Categoria extends sequelize_1.Model {
}
exports.Categoria = Categoria;
Categoria.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING
    },
    descripcion: {
        type: sequelize_1.DataTypes.TEXT
    },
    estatus: {
        type: sequelize_1.DataTypes.CHAR(1),
        defaultValue: '1'
    },
    ip: {
        type: sequelize_1.DataTypes.STRING()
    }
}, {
    tableName: "Categoria",
    sequelize: database_1.sequelize, // passing the `sequelize` instance is required
});
Capitulo_1.Capitulo.belongsTo(Categoria, {
    foreignKey: 'idCategoria',
    as: 'categoria'
});
Categoria.hasMany(Capitulo_1.Capitulo, {
    foreignKey: 'idCategoria',
    as: 'capitulos'
});
