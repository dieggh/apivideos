import { Model, Optional, DataTypes, HasManyCreateAssociationMixin, HasOneGetAssociationMixin } from 'sequelize';
import { sequelize } from '../utils/database';
import { Administrador } from './Administrador';
import { Capitulo } from './Capitulo';
import { Departamento } from './Departamento';
import { Persona } from './Persona';

interface CategoriaAttributes {
  id: number;
  nombre: string;
  estatus: string;
  descripcion: string | null;
  ip: string;
}

interface CategoriaCreationAttributes extends Optional<CategoriaAttributes, "id" | "estatus"> { }

class Categoria extends Model<CategoriaAttributes, CategoriaCreationAttributes>
  implements CategoriaAttributes {
  public id!: number;
  public nombre!: string;
  public estatus!: string;
  public descripcion!: string | null;
  public ip!: string;

  //public getCapitulos!: HasManyGetAssociationsMixin<Administrador>; // Note the null assertions!
  public createCapitulo!: HasManyCreateAssociationMixin<Capitulo>;  
  public getAdministrador!: HasOneGetAssociationMixin<Administrador>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly capitulos?: Persona; // Note this is optional since it's only populated when explicitly requested in code
  public readonly administrador?: Administrador; // Note this is optional since it's only populated when explicitly requested in code
  public readonly Departamentos?: Departamento[]; // Note this is optional since it's only populated when explicitly requested in code
}


Categoria.init(
  {
    id:{
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    nombre:{
      type: DataTypes.STRING      
    },
    descripcion: {
      type: DataTypes.TEXT
    },
    estatus:{
      type: DataTypes.CHAR(1),
      defaultValue: '1'
    },
    ip:{
      type: DataTypes.STRING()
    }
  }
  ,
  {
    tableName: "Categoria",
    sequelize, // passing the `sequelize` instance is required
  }
);


Capitulo.belongsTo(Categoria, {
  foreignKey: 'idCategoria',
  as: 'categoria'
});
Categoria.hasMany(Capitulo, {
  foreignKey: 'idCategoria',
  as:'capitulos'
});

export { Categoria };