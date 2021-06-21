import { Model ,Optional, DataTypes, BelongsToManyGetAssociationsMixin , BelongsToManyCreateAssociationMixin } from 'sequelize';
import { sequelize } from './../utils/database';
import { Categoria } from './Categoria';
import { Departamento } from './Departamento';
import { Empleado } from './Empleado';

interface Departamento_CategoriaAttributes{    
    id: number;
    estatus: string;
    idDepartamento: number;
    idCategoria: number;
    ip: string;
}   

interface Departamento_CategoriaCreationAttributes extends Optional<Departamento_CategoriaAttributes, "id" | "estatus"> {}

class Departamento_Categoria extends Model<Departamento_CategoriaAttributes, Departamento_CategoriaCreationAttributes>
  implements Departamento_CategoriaAttributes{
    public id!: number;
    public estatus!: string;
    public ip!: string;
    public idDepartamento!: number;
    public idCategoria!: number;

    public getCategorias!: BelongsToManyGetAssociationsMixin<Categoria>; // Note the null assertions!        
    public getDepartamentos!: BelongsToManyGetAssociationsMixin<Departamento>;     
    
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly empleados?: Empleado[]; // Note this is optional since it's only populated when explicitly requested in code
    public readonly departamentos?: Departamento[]; // Note this is optional since it's only populated when explicitly requested in code

  }

  Departamento_Categoria.init(
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
      idCategoria:{
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
      tableName: "Departamento_Categoria",
      sequelize
    }
  );

  Categoria.belongsToMany(Departamento, { through: 'Departamento_Categoria', foreignKey: 'idDepartamento' });
  Departamento.belongsToMany(Categoria, { through: 'Departamento_Categoria', foreignKey: 'idCategoria'  });

  export { Departamento_Categoria };