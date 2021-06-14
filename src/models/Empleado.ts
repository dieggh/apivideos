import { Model ,Optional, DataTypes, Association } from 'sequelize';
import { sequelize } from './../utils/database';
import { EstadoModel } from './Estado';
import { Persona } from './Persona';
import { Usuario } from './Usuario';


interface EmpleadoAttributes{    
    id: number;
    calle: string | null;
    colonia: string | null;
    ciudad: string | null;    
    cp: string | null;
    numInt: string | null;
    numExt: string | null;
    noInterno: string | null;  
    idEstado: number  
}   

interface EmpleadoCreationAttributes extends Optional<EmpleadoAttributes, "id"> {}

class Empleado extends Model<EmpleadoAttributes, EmpleadoCreationAttributes>
  implements EmpleadoAttributes{
    public id!: number;
    public calle!: string;
    public colonia!: string;
    public ciudad!: string | null;
    public cp!: string | null;
    public numExt!: string;
    public numInt!: string;
    public noInterno!: string | null;
    public idEstado!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    
    public readonly usuario?: Usuario;
    public readonly persona?: Persona; // Note this is optional since it's only populated when explicitly requested in code

    public static associations: {
      persona: Association<Empleado, Persona>;
      usuario: Association<Empleado, Usuario>;
    };

  }

  Empleado.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      calle: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      cp: {
        type: new DataTypes.STRING(10),
        allowNull: true,
      },
      ciudad: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      colonia: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      numInt:{
        type: DataTypes.STRING(10),
        allowNull: true
      },
      numExt:{
        type: DataTypes.STRING(10),
        allowNull: true
      },
      noInterno:{
        type: DataTypes.STRING,
        allowNull: true
      },
      idEstado:{
        type: DataTypes.INTEGER,
      }

      
    },
    {
      tableName: "Empleado",
      sequelize, // passing the `sequelize` instance is required
    }
  );
// We need to declare an interface for our model that is basically what our class would be
/*interface EmpleadoInstance
  extends Model<EmpleadoAttributes, EmpleadoCreationAttributes>,
    EmpleadoAttributes {}

const EmpleadoModel = sequelize.define<EmpleadoInstance>("Empleado", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    calle:{
      type: DataTypes.STRING,
      allowNull: true
    },
    colonia:{
      type: DataTypes.STRING,
      allowNull: true
    },
    ciudad:{
      type: DataTypes.STRING,
      allowNull: true
    },
    cp:{
      type: DataTypes.STRING(10),
      allowNull: true
    },
    numInt:{
      type: DataTypes.STRING(10),
      allowNull: true
    },
    numExt:{
      type: DataTypes.STRING(10),
      allowNull: true
    },
    noInterno:{
      type: DataTypes.STRING,
    },
    idPersona: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    idUsuario:{
      type: DataTypes.INTEGER.UNSIGNED
    },     
    idEstado:{
      type: DataTypes.INTEGER.UNSIGNED
    }     
        
  },{    
    timestamps: true,
    freezeTableName: true
  });*/


  Empleado.belongsTo(Usuario, { foreignKey: 'idUsuario', as : 'usuario' });
  Usuario.hasOne(Empleado, { foreignKey: 'idUsuario' });

  Empleado.belongsTo(Persona, { foreignKey: "idPersona", as: 'persona' });
  Persona.hasOne(Empleado,  {     
    foreignKey: 'idPersona',        
  });
//*  Empleado.belongsTo(EstadoModel, { foreignKey: 'idEstado' });
  //EstadoModel.hasMany(Empleado, { foreignKey: 'idEstado' });

  export { Empleado };