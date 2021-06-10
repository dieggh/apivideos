import { Model ,Optional, DataTypes } from 'sequelize';
import { sequelize } from './../utils/database';

interface PersonaAttributes{    
    idPersona: number;
    nombre: string;
    primerAp: string;
    segundoAp: string;
    email: string;
    foto: string | null;   
    estatus: string;
    ip: string;
}   

interface PersonaCreationAttributes extends Optional<PersonaAttributes, "idPersona"> {}

// We need to declare an interface for our model that is basically what our class would be
interface PersonaInstance
  extends Model<PersonaAttributes, PersonaCreationAttributes>,
    PersonaAttributes {}

const PersonaModel = sequelize.define<PersonaInstance>("Persona", {
    idPersona: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    nombre: {
      type: DataTypes.STRING,
    },
    primerAp: {
        type: DataTypes.STRING
    },
    segundoAp:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING,
        unique: true 
    },
    foto:{
        type: DataTypes.STRING,
        allowNull: true
    },
    estatus:{
        type: DataTypes.CHAR(1)
    },
    ip: {
      type: DataTypes.STRING(54)
    }
        
  },{    
    timestamps: true
  });

  export { PersonaModel };