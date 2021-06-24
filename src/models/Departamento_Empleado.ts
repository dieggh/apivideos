import { Model ,Optional, DataTypes, BelongsToManyGetAssociationsMixin , BelongsToManyCreateAssociationMixin } from 'sequelize';
import { sequelize } from './../utils/database';
import { Departamento } from './Departamento';
import { Empleado } from './Empleado';

interface Departamento_EmpleadoAttributes{    
    id: number;
    estatus: string;
    idDepartamento: number;
    idEmpleado: number;
    ip: string;
}   

interface Departamento_EmpleadoCreationAttributes extends Optional<Departamento_EmpleadoAttributes, "id" | "estatus"> {}

class Departamento_Empleado extends Model<Departamento_EmpleadoAttributes, Departamento_EmpleadoCreationAttributes>
  implements Departamento_EmpleadoAttributes{
    public id!: number;
    public estatus!: string;
    public ip!: string;
    public idDepartamento!: number;
    public idEmpleado!: number;

    public getEmpleados!: BelongsToManyGetAssociationsMixin<Empleado>; // Note the null assertions!        
    public getDepartamentos!: BelongsToManyGetAssociationsMixin<Departamento>;     
    
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly empleados?: Empleado[]; // Note this is optional since it's only populated when explicitly requested in code
    public readonly departamentos?: Departamento[]; // Note this is optional since it's only populated when explicitly requested in code

  }

  Departamento_Empleado.init(
    {
      id:{
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      idDepartamento:{
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      idEmpleado:{
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
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
      tableName: "Departamento_Empleado",
      sequelize
    }
  );

  Empleado.belongsToMany(Departamento, { through: 'Departamento_Empleado', foreignKey: 'idEmpleado', as: 'Departamento' });
  Departamento.belongsToMany(Empleado, { through: 'Departamento_Empleado', foreignKey: 'idDepartamento', as: "Empleados" });

  export { Departamento_Empleado };