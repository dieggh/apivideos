import { Model ,Optional, DataTypes } from 'sequelize';
import { sequelize } from './../utils/database';
import { EstadoModel } from './Estado';
import { PersonaModel } from './Persona';
import { UsuarioModel } from './Usuario';

interface EmpleadoAttributes{    
    id: number;
    calle: string;
    colonia: string;
    ciudad: string;    
    cp: string;
    numInt: string;
    numExt: string;
    noInterno: string;
}   

interface EmpleadoCreationAttributes extends Optional<EmpleadoAttributes, "id"> {}

// We need to declare an interface for our model that is basically what our class would be
interface EmpleadoInstance
  extends Model<EmpleadoAttributes, EmpleadoCreationAttributes>,
    EmpleadoAttributes {}

const EmpleadoModel = sequelize.define<EmpleadoInstance>("Empleado", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    calle:{
      type: DataTypes.STRING,
    },
    colonia:{
      type: DataTypes.STRING,
    },
    ciudad:{
      type: DataTypes.STRING,
    },
    cp:{
      type: DataTypes.STRING(10),
    },
    numInt:{
      type: DataTypes.STRING(10),
    },
    numExt:{
      type: DataTypes.STRING(10),
    },
    noInterno:{
      type: DataTypes.STRING,
    }
        
  },{    
    timestamps: true,
    freezeTableName: true
  });

  /*EmpleadoModel.belongsTo(PersonaModel, { foreignKey: 'idPersona' });
  PersonaModel.hasMany(EmpleadoModel, { foreignKey: 'idPersona' });

  EmpleadoModel.belongsTo(UsuarioModel, { foreignKey: 'idUsuario' });
  UsuarioModel.hasOne(EmpleadoModel, { foreignKey: 'idUsuario' });*/

  EmpleadoModel.belongsTo(PersonaModel);
  PersonaModel.hasMany(EmpleadoModel);

  EmpleadoModel.belongsTo(UsuarioModel);
  UsuarioModel.hasOne(EmpleadoModel);

  EmpleadoModel.belongsTo(EstadoModel);
  EstadoModel.hasMany(EmpleadoModel);

  export { EmpleadoModel };