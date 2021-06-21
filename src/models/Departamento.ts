import { Model ,Optional, DataTypes, HasOneGetAssociationMixin, HasOneCreateAssociationMixin } from 'sequelize';
import { sequelize } from './../utils/database';
import { Administrador } from './Administrador';
import { Empleado } from './Empleado';

interface DepartamentoAttributes{    
    id: number;
    nombre: string;
    descripcion: string | null;
    estatus: string;
    ip: string;
}   

interface DepartamentoCreationAttributes extends Optional<DepartamentoAttributes, "id" | "estatus"> {}

class Departamento extends Model<DepartamentoAttributes, DepartamentoCreationAttributes>
  implements DepartamentoAttributes{
    public id!: number;
    public nombre!: string;
    public descripcion!: string;
    public estatus!: string;
    public ip!: string;

    public getAdministrador!: HasOneGetAssociationMixin<Administrador>; // Note the null assertions!          
    
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly administrador?: Administrador; // Note this is optional since it's only populated when explicitly requested in code
    public readonly empleado?: Empleado; // Note this is optional since it's only populated when explicitly requested in code
    public readonly Empleados?: Empleado[]; // Note this is optional since it's only populated when explicitly requested in code

  }

  Departamento.init(
    {
      id:{
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      descripcion: {
        type: new DataTypes.TEXT,
        allowNull: true,
      },
      estatus: {
        type: new DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: '1'
      },
      ip: {
        type: new DataTypes.STRING,
        allowNull: false,
      },
    },{
      tableName: "Departamento",
      sequelize
    }
  )

  export { Departamento };