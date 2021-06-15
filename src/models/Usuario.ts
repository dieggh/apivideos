import { Model ,Optional, DataTypes } from 'sequelize';
import { sequelize } from './../utils/database';
import { Administrador } from './Administrador';
import { Empleado } from './Empleado';

interface UsuarioAttributes{    
    id: number;    
    password: string;   
    email: string;
    nivelAcceso: number;
    estatus: string;   
    token: string
}   

interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, "id" | "estatus"> {}


class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes>
  implements UsuarioAttributes{
    public id!: number;
    public password!: string;
    public email!: string;
    public nivelAcceso!: number;    
    public estatus!: string;
    public token!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly empleado?: Empleado; // Note this is optional since it's only populated when explicitly requested in code
    public readonly administrador?: Administrador; // Note this is optional since it's only populated when explicitly requested in code
  }

  Usuario.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      password: {
        type: new DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: new DataTypes.STRING,
        allowNull: false,
      },
      nivelAcceso: {
        type: new DataTypes.INTEGER,
        allowNull: true,
      },
      estatus:{
          type: DataTypes.CHAR(1),
          defaultValue: "1"
      },
      token:{
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: "Usuario",
      sequelize, // passing the `sequelize` instance is required
    }
  );
// We need to declare an interface for our model that is basically what our class would be
/*interface UsuarioInstance
  extends Model<UsuarioAttributes, UsuarioCreationAttributes>,
    UsuarioAttributes {}

const UsuarioModel = sequelize.define<UsuarioInstance>("Usuario", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true
    },
    password: {
      type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING
    },
    nivelAcceso: {
      type: DataTypes.TINYINT
    },
    estatus:{
        type: DataTypes.CHAR(1),
        defaultValue: "1"
    },   
        
  },{    
    timestamps: true,
    freezeTableName: true
  });*/

  export { Usuario, UsuarioAttributes };