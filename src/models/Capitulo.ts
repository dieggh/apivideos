import { Model ,Optional, DataTypes } from 'sequelize';
import { sequelize } from '../utils/database';
import { CategoriaVideoModel } from './CategoriaVideo';

interface CapituloAttributes{    
    idCapitulo: number;
    nombre: string;
    estatus: string;
    ip: string;
}   

interface CapituloCreationAttributes extends Optional<CapituloAttributes, "idCapitulo"> {}

// We need to declare an interface for our model that is basically what our class would be
interface CapituloInstance
  extends Model<CapituloAttributes, CapituloCreationAttributes>,
    CapituloAttributes {}

const CapituloModel = sequelize.define<CapituloInstance>("Capitulo", {
    idCapitulo: {
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

  CapituloModel.belongsTo(CategoriaVideoModel);
  CategoriaVideoModel.hasMany(CapituloModel);

  export { CapituloModel };