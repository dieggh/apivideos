"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Departamento_Categoria = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("./../utils/database");
const Categoria_1 = require("./Categoria");
const Departamento_1 = require("./Departamento");
class Departamento_Categoria extends sequelize_1.Model {
}
exports.Departamento_Categoria = Departamento_Categoria;
Departamento_Categoria.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    idDepartamento: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    idCategoria: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
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
    tableName: "Departamento_Categoria",
    sequelize: database_1.sequelize
});
Categoria_1.Categoria.belongsToMany(Departamento_1.Departamento, { through: 'Departamento_Categoria', foreignKey: 'idDepartamento' });
Departamento_1.Departamento.belongsToMany(Categoria_1.Categoria, { through: 'Departamento_Categoria', foreignKey: 'idCategoria' });
