import { Model ,Optional, DataTypes } from 'sequelize';
import { sequelize } from './../utils/database';

interface PersonaAttributes{    
    id: number;
    nombre: string;
    primerAp: string;
    segundoAp: string | null;
    email: string;
    telefono: string | null;
    estatus: string;
    ip: string;
}   

interface PersonaCreationAttributes extends Optional<PersonaAttributes, "id"> {}

// We need to declare an interface for our model that is basically what our class would be
interface PersonaInstance
  extends Model<PersonaAttributes, PersonaCreationAttributes>,
    PersonaAttributes {}

const PersonaModel = sequelize.define<PersonaInstance>("Persona", {
    id: {
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
        type: DataTypes.STRING,
        allowNull: true
    },
    email:{
        type: DataTypes.STRING,
        unique: true 
    },
    telefono:{
      type: DataTypes.STRING(10),
    },
    estatus:{
        type: DataTypes.CHAR(1)
    },
    ip: {
      type: DataTypes.STRING(54)
    }
        
  },{    
    timestamps: true,
    freezeTableName: true
  });

  export { PersonaModel };