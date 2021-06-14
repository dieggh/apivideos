import { Model ,Optional, DataTypes, HasOneCreateAssociationMixin, Association } from 'sequelize';
import { sequelize } from './../utils/database';
import { Persona } from './Persona';
import { Usuario } from './Usuario';

interface AdministradorAttributes{    
    id: number;    
    noInterno: string | null,      
}   

interface AdministradorCreationAttributes extends Optional<AdministradorAttributes, "id"> {}

class Administrador extends Model<AdministradorAttributes, AdministradorCreationAttributes>
  implements AdministradorAttributes{
    public id!: number;
    public noInterno!: string | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly persona?: Persona; // Note this is optional since it's only populated when explicitly requested in code
    public readonly usuario?: Usuario; // Note this is optional since it's only populated when explicitly requested in code
    
    public static associations: {
      persona: Association<Administrador, Persona>;
      usuario: Association<Administrador, Usuario>;
    };

    public createUsuario!: HasOneCreateAssociationMixin<Usuario>;
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
        allowNull: false,
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

  Administrador.belongsTo(Persona, { foreignKey: "idPersona"} );

  Persona.hasOne(Administrador, { 
    foreignKey: 'idPersona',
  });

  export { Administrador };