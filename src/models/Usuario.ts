import { Model ,Optional, DataTypes } from 'sequelize';
import { sequelize } from './../utils/database';

interface UsuarioAttributes{    
    id: number;    
    password: string;   
    email: string;
    estatus: string;   
}   

interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, "id"> {}

// We need to declare an interface for our model that is basically what our class would be
interface UsuarioInstance
  extends Model<UsuarioAttributes, UsuarioCreationAttributes>,
    UsuarioAttributes {}

const UsuarioModel = sequelize.define<UsuarioInstance>("Usuario", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    password: {
      type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING
    },
    estatus:{
        type: DataTypes.CHAR(1)
    },   
        
  },{    
    timestamps: true,
    freezeTableName: true
  });

  export { UsuarioModel };