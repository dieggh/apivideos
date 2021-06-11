import { Model ,Optional, DataTypes } from 'sequelize';
import { sequelize } from './../utils/database';
import { PersonaModel } from './Persona';
import { UsuarioModel } from './Usuario';

interface AdministradorAttributes{    
    id: number;
    nivelAcceso: number;
    
}   

interface AdministradorCreationAttributes extends Optional<AdministradorAttributes, "id"> {}

// We need to declare an interface for our model that is basically what our class would be
interface AdministradorInstance
  extends Model<AdministradorAttributes, AdministradorCreationAttributes>,
    AdministradorAttributes {}

const AdministradorModel = sequelize.define<AdministradorInstance>("Administrador", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    nivelAcceso:{
        type: DataTypes.INTEGER,
    }
        
  },{    
    timestamps: true,
    freezeTableName: true
  });

  AdministradorModel.belongsTo(PersonaModel);
  PersonaModel.hasMany(AdministradorModel);

  AdministradorModel.belongsTo(UsuarioModel);
  UsuarioModel.hasOne(AdministradorModel);

  export { AdministradorModel };