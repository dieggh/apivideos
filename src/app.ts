import { AdministradorModel } from "./models/Administrador";
import { CapituloModel } from "./models/Capitulo";
import { Capitulo_DepartamentoModel } from "./models/Capitulo_Departamento";
import { CategoriaCapituloModel } from "./models/CategoriaCapitulo";
import { DepartamentoModel } from "./models/Departamento";
import { EmpleadoModel } from "./models/Empleado";
import { EstadoModel } from "./models/Estado";
import { PersonaModel } from "./models/Persona";
import { UsuarioModel } from "./models/Usuario";
import { VistaCapituloModel } from "./models/VistaCapitulo";

const express = require('express');

const app = express();

PersonaModel.sync().then(async response => {
    await UsuarioModel.sync();
    await EstadoModel.sync();
    await EmpleadoModel.sync();
    await AdministradorModel.sync();
    await CategoriaCapituloModel.sync();
    await CapituloModel.sync();
    await DepartamentoModel.sync();
    await Capitulo_DepartamentoModel.sync();    
    await VistaCapituloModel.sync();
    
app.listen(4001);
console.log("corriendo puerto 4001");
}).catch(error =>{
    console.log(error)
})

