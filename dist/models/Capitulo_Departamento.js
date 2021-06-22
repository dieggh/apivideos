"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Capitulo_DepartamentoModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../utils/database");
const Departamento_1 = require("./Departamento");
const Capitulo_1 = require("./Capitulo");
const Capitulo_DepartamentoModel = database_1.sequelize.define("Capitulo_Departamento", {
    id: {
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
    },
    estatus: {
        type: sequelize_1.DataTypes.CHAR(1)
    },
    ip: {
        type: sequelize_1.DataTypes.STRING(54)
    }
}, {
    timestamps: true,
    freezeTableName: true
});
exports.Capitulo_DepartamentoModel = Capitulo_DepartamentoModel;
Departamento_1.DepartamentoModel.belongsToMany(Capitulo_1.CapituloModel, { through: 'Capitulo_Departamento' });
Capitulo_1.CapituloModel.belongsToMany(Departamento_1.DepartamentoModel, { through: 'Capitulo_Departamento' });
