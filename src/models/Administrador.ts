import { Model ,Optional, DataTypes, HasOneCreateAssociationMixin, Association, HasManyGetAssociationsMixin, HasManyCreateAssociationMixin, HasOneGetAssociationMixin } from 'sequelize';
import { sequelize } from './../utils/database';
import { CategoriaCapitulo } from './CategoriaCapitulo';
import { Departamento } from './Departamento';
import { Empleado } from './Empleado';
import { Persona } from './Persona';
import { Usuario } from './Usuario';

interface AdministradorAttributes{    
    id: number;    
    noInterno: string | null,      
    estatus: string
}   

interface AdministradorCreationAttributes extends Optional<AdministradorAttributes, "id" | "estatus"> {}

class Administrador extends Model<AdministradorAttributes, AdministradorCreationAttributes>
  implements AdministradorAttributes{
    public id!: number;
    public noInterno!: string | null;
    public estatus!: string;
    public idAdministrador!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly persona?: Persona; // Note this is optional since it's only populated when explicitly requested in code
    public readonly usuario?: Usuario; // Note this is optional since it's only populated when explicitly requested in code
    public readonly departamentos?: Departamento[];
    public readonly empleados?: Empleado[];
    public readonly categorias?: CategoriaCapitulo[];

    public static associations: {
      persona: Association<Administrador, Persona>;
      usuario: Association<Administrador, Usuario>;
    };

    public createUsuario!: HasOneCreateAssociationMixin<Usuario>;
    public getDepartamentos!: HasManyGetAssociationsMixin<Departamento>;
    public getCategorias!: HasManyGetAssociationsMixin<CategoriaCapitulo>;
    public getEmpleados!: HasManyGetAssociationsMixin<Empleado>;
    public getUsuario!: HasOneGetAssociationMixin<Usuario>;
    public getPersona!: HasOneGetAssociationMixin<Persona>;
    public createDepartamento!: HasManyCreateAssociationMixin<Departamento>;
    public createCategoria!: HasManyCreateAssociationMixin<CategoriaCapitulo>;
  }

  Administrador.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      noInterno: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      estatus:{
        type: DataTypes.CHAR(1),
        defaultValue: '1'
      }
    },
    {
      tableName: "Administrador",
      sequelize, // passing the `sequelize` instance is required
    }
  );
// We need to declare an interface for our model that is basically what our class would be
/*interface AdministradorInstance
  extends Model<AdministradorAttributes, AdministradorCreationAttributes>,
    AdministradorAttributes {}

const AdministradorModel = sequelize.define<AdministradorInstance>("Administrador", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true      
    },
    noInterno: {
      type: DataTypes.STRING,
      allowNull: true
    },  
  },{    
    timestamps: true,
    freezeTableName: true
  });*/



  Administrador.belongsTo(Usuario, { foreignKey: "idUsuario", as: 'usuario' });
  Usuario.hasOne(Administrador, {     
    foreignKey: 'idUsuario',    
  });

  Administrador.belongsTo(Persona, { foreignKey: "idPersona", as: 'persona'} );

  Persona.hasOne(Administrador, { 
    foreignKey: 'idPersona',
  });

  Departamento.belongsTo(Administrador,  { foreignKey:'idAdministrador', as: 'administrador' });
  Administrador.hasMany(Departamento, { foreignKey:'idAdministrador', as: 'departamentos' });

  Empleado.belongsTo(Administrador,  { foreignKey:'idAdministrador', as: 'empleados' });
  Administrador.hasMany(Empleado, { foreignKey:'idAdministrador', as: 'empleados' });

  
  CategoriaCapitulo.belongsTo(Administrador, { foreignKey: 'idAdministrador', as: 'administrador' });
  Administrador.hasMany(CategoriaCapitulo, { foreignKey: 'idAdministrador', as: 'categorias' });

  export { Administrador };