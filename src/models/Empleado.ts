import { Model ,Optional, DataTypes } from 'sequelize';
import { sequelize } from './../utils/database';
import { PersonaModel } from './Persona';
import { UsuarioModel } from './Usuario';

interface EmpleadoAttributes{    
    idEmpleado: number;
}   

interface EmpleadoCreationAttributes extends Optional<EmpleadoAttributes, "idEmpleado"> {}

// We need to declare an interface for our model that is basically what our class would be
interface EmpleadoInstance
  extends Model<EmpleadoAttributes, EmpleadoCreationAttributes>,
    EmpleadoAttributes {}

const EmpleadoModel = sequelize.define<EmpleadoInstance>("Empleado", {
    idEmpleado: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    
        
  },{    
    timestamps: true
  });

  EmpleadoModel.belongsTo(PersonaModel, { foreignKey: 'idPersona' });
  PersonaModel.hasMany(EmpleadoModel, { foreignKey: 'idPersona' });

  EmpleadoModel.belongsTo(UsuarioModel, { foreignKey: 'idUsuario' });
  UsuarioModel.hasOne(EmpleadoModel, { foreignKey: 'idUsuario' });

  export { EmpleadoModel };