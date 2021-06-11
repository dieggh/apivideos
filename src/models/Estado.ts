import { Model ,Optional, DataTypes } from 'sequelize';
import { sequelize } from './../utils/database';

interface EstadoAttributes{    
    id: number;
    nombre: string;
}   

interface EstadoCreationAttributes extends Optional<EstadoAttributes, "id"> {}

// We need to declare an interface for our model that is basically what our class would be
interface EstadoInstance
  extends Model<EstadoAttributes, EstadoCreationAttributes>,
    EstadoAttributes {}

const EstadoModel = sequelize.define<EstadoInstance>("Estado", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    nombre:{
      type: DataTypes.STRING,
    },
        
  },{    
    timestamps: false,
    freezeTableName: true
  });

  /*EstadoModel.belongsTo(PersonaModel, { foreignKey: 'idPersona' });
  PersonaModel.hasMany(EstadoModel, { foreignKey: 'idPersona' });

  EstadoModel.belongsTo(UsuarioModel, { foreignKey: 'idUsuario' });
  UsuarioModel.hasOne(EstadoModel, { foreignKey: 'idUsuario' });*/
  export { EstadoModel };