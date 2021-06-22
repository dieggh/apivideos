"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Administrador = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("./../utils/database");
const Categoria_1 = require("./Categoria");
const Departamento_1 = require("./Departamento");
const Empleado_1 = require("./Empleado");
const Persona_1 = require("./Persona");
const Usuario_1 = require("./Usuario");
class Administrador extends sequelize_1.Model {
}
exports.Administrador = Administrador;
Administrador.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    noInterno: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    estatus: {
        type: sequelize_1.DataTypes.CHAR(1),
        defaultValue: '1'
    }
}, {
    tableName: "Administrador",
    sequelize: database_1.sequelize, // passing the `sequelize` instance is required
});
// We need to declare an interface for our model that is basically what our class would be
/*interface AdministradorInstance
  extends Model<AdministradorAttributes, AdministradorCreationAttributes>,
    AdministradorAttributes {}

const AdministradorModel = sequelize.define<AdministradorInstance>("Administrador", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true
    },
    noInterno: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },{
    timestamps: true,
    freezeTableName: true
  });*/
Administrador.belongsTo(Usuario_1.Usuario, { foreignKey: "idUsuario", as: 'usuario' });
Usuario_1.Usuario.hasOne(Administrador, {
    foreignKey: 'idUsuario',
});
Administrador.belongsTo(Persona_1.Persona, { foreignKey: "idPersona", as: 'persona' });
Persona_1.Persona.hasOne(Administrador, {
    foreignKey: 'idPersona',
});
Departamento_1.Departamento.belongsTo(Administrador, { foreignKey: 'idAdministrador', as: 'administrador' });
Administrador.hasMany(Departamento_1.Departamento, { foreignKey: 'idAdministrador', as: 'departamentos' });
Empleado_1.Empleado.belongsTo(Administrador, { foreignKey: 'idAdministrador', as: 'administrador' });
Administrador.hasMany(Empleado_1.Empleado, { foreignKey: 'idAdministrador', as: 'empleados' });
Categoria_1.Categoria.belongsTo(Administrador, { foreignKey: 'idAdministrador', as: 'administrador' });
Administrador.hasMany(Categoria_1.Categoria, { foreignKey: 'idAdministrador', as: 'categorias' });
