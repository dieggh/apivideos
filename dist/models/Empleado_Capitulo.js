"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empleado_Capitulo = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../utils/database");
const Capitulo_1 = require("./Capitulo");
const Empleado_1 = require("./Empleado");
class Empleado_Capitulo extends sequelize_1.Model {
}
exports.Empleado_Capitulo = Empleado_Capitulo;
Empleado_Capitulo.init({
    id: {
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true
    },
    fechaVista: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    fechaConclusion: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    idCapitulo: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    idEmpleado: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    estatus: {
        type: sequelize_1.DataTypes.CHAR(1),
        defaultValue: '1',
        comment: "1: visto, 2: concluído"
    },
    ip: {
        type: sequelize_1.DataTypes.STRING(54)
    }
}, {
    tableName: 'Empleado_Capitulo',
    sequelize: database_1.sequelize
});
Empleado_1.Empleado.belongsToMany(Capitulo_1.Capitulo, { through: 'Empleado_Capitulo', foreignKey: 'idCapitulo' });
Capitulo_1.Capitulo.belongsToMany(Empleado_1.Empleado, { through: 'Empleado_Capitulo', foreignKey: 'idEmpleado' });
