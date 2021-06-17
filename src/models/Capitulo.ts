import { Model ,Optional, DataTypes } from 'sequelize';
import { sequelize } from '../utils/database';
import { CategoriaCapitulo } from './CategoriaCapitulo';

interface CapituloAttributes{    
    id: number;
    nombre: string;
    descripcion: string | null;
    tipo: string;
    path: string;
    duracion: string | null;
    estatus: string;
    ip: string;
}   

interface CapituloCreationAttributes extends Optional<CapituloAttributes, "id"| "duracion" | "estatus">{}

class Capitulo extends Model<CapituloAttributes, CapituloCreationAttributes>
  implements CapituloAttributes{
    public id!: number;
    public nombre!: string;
    public descripcion!: string | null;
    public tipo!: string;
    public path!: string;    
    public duracion!: string | null;    
    public estatus!: string;    
    public ip!: string;

    //public getAdministrador!: HasOneGetAssociationMixin<Administrador>; // Note the null assertions!
    //public createAdministrador!: HasOneCreateAssociationMixin<Administrador>;
    //public createEmpleado!: HasOneCreateAssociationMixin<Empleado>;
    //public hasProject!: HasManyHasAssociationMixin<Project, number>;
    //public countProjects!: HasManyCountAssociationsMixin;
    //public createProject!: HasManyCreateAssociationMixin<Project>;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //public readonly empleado?: Persona; // Note this is optional since it's only populated when explicitly requested in code
    //public readonly administrador?: Persona; // Note this is optional since it's only populated when explicitly requested in code
  }

  Capitulo.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      tipo: {
        type: DataTypes.STRING,        
        comment: "video, other"
      },
      path: {
        type: DataTypes.STRING,
      },
      duracion:{
        type: DataTypes.INTEGER,
        allowNull: true
      },
      estatus:{
          type: DataTypes.CHAR(1),
          defaultValue: '1'          
      },
      ip: {
        type: DataTypes.STRING(60)
      }        
    },
    {
      tableName: "Capitulo",
      sequelize
    }
  )

  

  export { Capitulo };