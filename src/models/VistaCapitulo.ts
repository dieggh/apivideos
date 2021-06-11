import { Model, Optional, DataTypes } from 'sequelize';
import { sequelize } from './../utils/database';
import { CapituloModel } from './Capitulo';
import { EmpleadoModel } from './Empleado';

interface VistaCapituloAttributes{    
    id: number;
    fechaVista: Date;
    fechaConclusion: Date | null
    estatus: string;
    ip: string;
}   

interface VistaCapituloCreationAttributes extends Optional<VistaCapituloAttributes, "id"> {}

// We need to declare an interface for our model that is basically what our class would be
interface VistaCapituloInstance
  extends Model<VistaCapituloAttributes, VistaCapituloCreationAttributes>,
    VistaCapituloAttributes {}

const VistaCapituloModel = sequelize.define<VistaCapituloInstance>("VistaCapitulo", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    fechaVista: {
      type: DataTypes.DATE,
    },
    fechaConclusion: {
        type: DataTypes.DATE,
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

  
  VistaCapituloModel.belongsTo(EmpleadoModel);
  EmpleadoModel.hasMany(VistaCapituloModel);

  VistaCapituloModel.belongsTo(CapituloModel);
  CapituloModel.hasMany(VistaCapituloModel)

  export { VistaCapituloModel };