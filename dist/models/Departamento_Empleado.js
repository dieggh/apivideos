"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Departamento_Empleado = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("./../utils/database");
const Departamento_1 = require("./Departamento");
const Empleado_1 = require("./Empleado");
class Departamento_Empleado extends sequelize_1.Model {
}
exports.Departamento_Empleado = Departamento_Empleado;
Departamento_Empleado.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    idDepartamento: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    idEmpleado: {
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
    tableName: "Departamento_Empleado",
    sequelize: database_1.sequelize
});
Empleado_1.Empleado.belongsToMany(Departamento_1.Departamento, { through: 'Departamento_Empleado', foreignKey: 'idDepartamento', as: 'Departamento' });
Departamento_1.Departamento.belongsToMany(Empleado_1.Empleado, { through: 'Departamento_Empleado', foreignKey: 'idEmpleado', as: "Empleados" });
