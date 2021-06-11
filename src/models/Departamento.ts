import { Model ,Optional, DataTypes } from 'sequelize';
import { sequelize } from './../utils/database';
import { AdministradorModel } from './Administrador';

interface DepartamentoAttributes{    
    id: number;
    nombre: string;
    estatus: string;
    ip: string;
}   

interface DepartamentoCreationAttributes extends Optional<DepartamentoAttributes, "id"> {}

// We need to declare an interface for our model that is basically what our class would be
interface DepartamentoInstance
  extends Model<DepartamentoAttributes, DepartamentoCreationAttributes>,
    DepartamentoAttributes {}

const DepartamentoModel = sequelize.define<DepartamentoInstance>("Departamento", {
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
    ip: {
      type: DataTypes.STRING(54)
    }
        
  },{    
    timestamps: true,
    freezeTableName: true
  });

  
  DepartamentoModel.belongsTo(AdministradorModel);
  AdministradorModel.hasMany(DepartamentoModel);

  export { DepartamentoModel };