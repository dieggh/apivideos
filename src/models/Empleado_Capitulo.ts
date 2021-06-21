import { Model, Optional, DataTypes } from 'sequelize';
import { sequelize } from '../utils/database';
import { Capitulo } from './Capitulo';
import { Empleado } from './Empleado';


interface Empleado_CapituloAttributes {
  id: number;
  fechaVista: Date | null;
  fechaConclusion: Date | null
  estatus: string;
  ip: string;
  idEmpleado: number;
  idCapitulo: number;
}

interface Empleado_CapituloCreationAttributes extends Optional<Empleado_CapituloAttributes, "id" | "estatus"> { }

class Empleado_Capitulo extends Model<Empleado_CapituloAttributes, Empleado_CapituloCreationAttributes>
  implements Empleado_CapituloAttributes {
  public id!: number;
  public fechaVista!: Date | null;
  public fechaConclusion!: Date | null;
  public estatus!: string;
  public ip!: string;
  public idEmpleado!: number;
  public idCapitulo!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Empleado_Capitulo.init({
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true
  },
  fechaVista: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fechaConclusion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  idCapitulo:{
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  idEmpleado:{
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  estatus: {
    type: DataTypes.CHAR(1),
    defaultValue: '1',
    comment: "1: visto, 2: concluído"    
  },
  ip: {
    type: DataTypes.STRING(54)
  }
}, {
  tableName: 'Empleado_Capitulo',
  sequelize: sequelize
})

Empleado.belongsToMany(Capitulo ,{ through: 'Empleado_Capitulo', foreignKey: 'idCapitulo' });
Capitulo.belongsToMany(Empleado, { through: 'Empleado_Capitulo', foreignKey: 'idEmpleado' });

export { Empleado_Capitulo };