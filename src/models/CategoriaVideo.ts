import { Model ,Optional, DataTypes } from 'sequelize';
import { sequelize } from '../utils/database';

interface CategoriaVideoAttributes{    
    idCategoriaVideo: number;
    nombre: string;
    estatus: string;
    ip: string;
}   

interface CategoriaVideoCreationAttributes extends Optional<CategoriaVideoAttributes, "idCategoriaVideo"> {}

// We need to declare an interface for our model that is basically what our class would be
interface CategoriaVideoInstance
  extends Model<CategoriaVideoAttributes, CategoriaVideoCreationAttributes>,
    CategoriaVideoAttributes {}

const CategoriaVideoModel = sequelize.define<CategoriaVideoInstance>("CategoriaVideo", {
    idCategoriaVideo: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    nombre: {
      type: DataTypes.STRING,
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

  export { CategoriaVideoModel };