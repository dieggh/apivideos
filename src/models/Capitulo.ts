import { Model ,Optional, DataTypes } from 'sequelize';
import { sequelize } from '../utils/database';
import { CategoriaCapituloModel } from './CategoriaCapitulo';

interface CapituloAttributes{    
    id: number;
    nombre: string;
    desc: string;
    tipo: string;
    path: string;
    duracion?: string;
    estatus: string;
    ip: string;
}   

interface CapituloCreationAttributes extends Optional<CapituloAttributes, "id"| "duracion">{}


// We need to declare an interface for our model that is basically what our class would be
interface CapituloInstance
  extends Model<CapituloAttributes, CapituloCreationAttributes>,
    CapituloAttributes {}

const CapituloModel = sequelize.define<CapituloInstance>("Capitulo", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    nombre: {
      type: DataTypes.STRING,
    },
    desc: {
      type: DataTypes.TEXT,
    },
    tipo: {
      type: DataTypes.STRING,
    },
    path: {
      type: DataTypes.STRING,
    },
    duracion:{
      type: DataTypes.INTEGER,
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

  CapituloModel.belongsTo(CategoriaCapituloModel);
  CategoriaCapituloModel.hasMany(CapituloModel);

  export { CapituloModel };