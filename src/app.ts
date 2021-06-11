import { error } from "console";
import { EmpleadoModel } from "./models/Empleado";
import { PersonaModel } from "./models/Persona";
import { UsuarioModel } from "./models/Usuario";

const express = require('express');

const app = express();

EmpleadoModel.sync().then(response => {
    
app.listen(4001);
console.log("corriendo puerto 4001");
}).catch(error =>{
    console.log(error)
})

