"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empleado = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("./../utils/database");
const Persona_1 = require("./Persona");
const Usuario_1 = require("./Usuario");
class Empleado extends sequelize_1.Model {
}
exports.Empleado = Empleado;
Empleado.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    calle: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    cp: {
        type: new sequelize_1.DataTypes.STRING(10),
        allowNull: true,
    },
    ciudad: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    colonia: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    numInt: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true
    },
    numExt: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true
    },
    noInterno: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    estatus: {
        type: sequelize_1.DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: '1'
    },
    idEstado: {
        type: sequelize_1.DataTypes.INTEGER,
    }
}, {
    tableName: "Empleado",
    sequelize: database_1.sequelize, // passing the `sequelize` instance is required
});
// We need to declare an interface for our model that is basically what our class would be
/*interface EmpleadoInstance
  extends Model<EmpleadoAttributes, EmpleadoCreationAttributes>,
    EmpleadoAttributes {}

const EmpleadoModel = sequelize.define<EmpleadoInstance>("Empleado", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    calle:{
      type: DataTypes.STRING,
      allowNull: true
    },
    colonia:{
      type: DataTypes.STRING,
      allowNull: true
    },
    ciudad:{
      type: DataTypes.STRING,
      allowNull: true
    },
    cp:{
      type: DataTypes.STRING(10),
      allowNull: true
    },
    numInt:{
      type: DataTypes.STRING(10),
      allowNull: true
    },
    numExt:{
      type: DataTypes.STRING(10),
      allowNull: true
    },
    noInterno:{
      type: DataTypes.STRING,
    },
    idPersona: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    idUsuario:{
      type: DataTypes.INTEGER.UNSIGNED
    },
    idEstado:{
      type: DataTypes.INTEGER.UNSIGNED
    }
        
  },{
    timestamps: true,
    freezeTableName: true
  });*/
Empleado.belongsTo(Usuario_1.Usuario, { foreignKey: 'idUsuario', as: 'usuario' });
Usuario_1.Usuario.hasOne(Empleado, { foreignKey: 'idUsuario' });
Empleado.belongsTo(Persona_1.Persona, { foreignKey: "idPersona", as: 'persona' });
Persona_1.Persona.hasOne(Empleado, {
    foreignKey: 'idPersona',
});
