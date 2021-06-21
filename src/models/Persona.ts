import { Model ,Optional, DataTypes,
   HasOneGetAssociationMixin, 
  HasOneCreateAssociationMixin } from 'sequelize';
import { sequelize } from './../utils/database';
import { Administrador } from './Administrador';
import { Empleado } from './Empleado';

interface PersonaAttributes{    
    id: number;
    nombre: string;
    primerAp: string;
    segundoAp: string | null;
    telefono: string | null;    
    ip: string;
}   

interface PersonaCreationAttributes extends Optional<PersonaAttributes, "id"> {}


class Persona extends Model<PersonaAttributes, PersonaCreationAttributes>
  implements PersonaAttributes{
    public id!: number;
    public nombre!: string;
    public primerAp!: string;
    public segundoAp!: string | null;
    public telefono!: string | null;    
    public ip!: string;

    public getAdministrador!: HasOneGetAssociationMixin<Administrador>; // Note the null assertions!
    public createAdministrador!: HasOneCreateAssociationMixin<Administrador>;
    public createEmpleado!: HasOneCreateAssociationMixin<Empleado>;
    //public hasProject!: HasManyHasAssociationMixin<Project, number>;
    //public countProjects!: HasManyCountAssociationsMixin;
    //public createProject!: HasManyCreateAssociationMixin<Project>;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly empleado?: Persona; // Note this is optional since it's only populated when explicitly requested in code
    public readonly administrador?: Persona; // Note this is optional since it's only populated when explicitly requested in code
  }

  Persona.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      primerAp: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      segundoAp: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      telefono:{
        type: DataTypes.STRING(10),
        allowNull: true
      },
      ip: {
        type: DataTypes.STRING(54)
      }
    },
    {
      tableName: "Persona",
      sequelize, // passing the `sequelize` instance is required
    }
  );
  
  export { Persona };