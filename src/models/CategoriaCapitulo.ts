import { Model ,Optional, DataTypes } from 'sequelize';
import { sequelize } from '../utils/database';

interface CategoriaCapituloAttributes{    
    id: number;
    nombre: string;
    estatus: string;
    desc: string;
    ip: string;
}   

interface CategoriaCapituloCreationAttributes extends Optional<CategoriaCapituloAttributes, "id"> {}

// We need to declare an interface for our model that is basically what our class would be
interface CategoriaCapituloInstance
  extends Model<CategoriaCapituloAttributes, CategoriaCapituloCreationAttributes>,
    CategoriaCapituloAttributes {}

const CategoriaCapituloModel = sequelize.define<CategoriaCapituloInstance>("CategoriaCapitulo", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    nombre: {
      type: DataTypes.STRING,
    },
    estatus:{
        type: DataTypes.CHAR(1)
    },
    desc:{
      type: DataTypes.TEXT
    },
    ip: {
      type: DataTypes.STRING(54)
    },

  },{    
    timestamps: true,
    freezeTableName: true
  });

  export { CategoriaCapituloModel };