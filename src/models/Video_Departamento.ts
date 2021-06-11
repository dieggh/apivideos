import { Model ,Optional, DataTypes } from 'sequelize';
import { sequelize } from '../utils/database';
import { DepartamentoModel } from './Departamento';
import { CapituloModel } from './Capitulo';

interface Video_DepartamentoAttributes{    
    idVideo_Departamento: number;    
    estatus: string;
    ip: string;
}   

interface Video_DepartamentoCreationAttributes extends Optional<Video_DepartamentoAttributes, "idVideo_Departamento"> {}

// We need to declare an interface for our model that is basically what our class would be
interface Video_DepartamentoInstance
  extends Model<Video_DepartamentoAttributes, Video_DepartamentoCreationAttributes>,
    Video_DepartamentoAttributes {}

const Video_DepartamentoModel = sequelize.define<Video_DepartamentoInstance>("Video_Departamento", {
    idVideo_Departamento: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
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

  Video_DepartamentoModel.belongsToMany(DepartamentoModel, { through: 'Video_Departamentos' });
  Video_DepartamentoModel.belongsToMany(CapituloModel, { through: 'Video_Departamentos' });

  export { Video_DepartamentoModel };