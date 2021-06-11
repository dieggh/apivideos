import { Model ,Optional, DataTypes } from 'sequelize';
import { sequelize } from '../utils/database';
import { DepartamentoModel } from './Departamento';
import { CapituloModel } from './Capitulo';

interface Capitulo_DepartamentoAttributes{    
    id: number;    
    estatus: string;
    ip: string;
}   

interface Capitulo_DepartamentoCreationAttributes extends Optional<Capitulo_DepartamentoAttributes, "id"> {}

// We need to declare an interface for our model that is basically what our class would be
interface Capitulo_DepartamentoInstance
  extends Model<Capitulo_DepartamentoAttributes, Capitulo_DepartamentoCreationAttributes>,
    Capitulo_DepartamentoAttributes {}

const Capitulo_DepartamentoModel = sequelize.define<Capitulo_DepartamentoInstance>("Capitulo_Departamento", {
    id: {
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
    timestamps: true,
    freezeTableName: true
  });

  DepartamentoModel.belongsToMany(CapituloModel, { through: 'Capitulo_Departamento' });
  CapituloModel.belongsToMany(DepartamentoModel, { through: 'Capitulo_Departamento' });

  export { Capitulo_DepartamentoModel };