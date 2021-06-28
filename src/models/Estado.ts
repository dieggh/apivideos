import { Model ,Optional, DataTypes } from 'sequelize';
import { sequelize } from './../utils/database';

interface EstadoAttributes{    
    id: number;
    nombre: string;
}   

interface EstadoCreationAttributes extends Optional<EstadoAttributes, "id"> {}

class Estado extends Model<EstadoAttributes, EstadoCreationAttributes>
  implements EstadoAttributes{
    public id!: number;
    public nombre!: string;
  }

  Estado.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: new DataTypes.STRING(128),        
      }
      
    },
    {
      tableName: "Estado",  
      timestamps: false,    
      sequelize, // passing the `sequelize` instance is required
    }
  );

  
  export { Estado };