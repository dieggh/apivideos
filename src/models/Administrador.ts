import { Model ,Optional, DataTypes } from 'sequelize';
import { sequelize } from './../utils/database';
import { PersonaModel } from './Persona';
import { UsuarioModel } from './Usuario';

interface AdministradorAttributes{    
    idAdministrador: number;
    nivelAcceso: number
}   

interface AdministradorCreationAttributes extends Optional<AdministradorAttributes, "idAdministrador"> {}

// We need to declare an interface for our model that is basically what our class would be
interface AdministradorInstance
  extends Model<AdministradorAttributes, AdministradorCreationAttributes>,
    AdministradorAttributes {}

const AdministradorModel = sequelize.define<AdministradorInstance>("Administrador", {
    idAdministrador: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    nivelAcceso:{
        type: DataTypes.INTEGER,
    }
        
  },{    
    timestamps: true
  });

  AdministradorModel.belongsTo(PersonaModel);
  PersonaModel.hasMany(AdministradorModel);

  AdministradorModel.belongsTo(UsuarioModel);
  UsuarioModel.hasOne(AdministradorModel);

  export { AdministradorModel };