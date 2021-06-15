import { Administrador } from "./models/Administrador";
import { Persona } from "./models/Persona";
import { Usuario } from "./models/Usuario";
import { sequelize } from "./utils/database";
import { authRoute } from './routes/auth';
import { departamentoRoute } from './routes/departamento';
import { Empleado } from "./models/Empleado";

const express = require('express');

const app = express();
app.use(express.json());

const sync = async() =>{
    
    await Persona.sync({
        force: true
    }).catch(error => {
        console.log(error)
    });
    await Usuario.sync({
        force: true
    }).catch(error => {
        console.log(error)
    });
    await Administrador.sync({
        force: true
    }).catch(error =>{
        console.log(error)
    })
    await Empleado.sync({
        force: true
    }).catch(error => {
        console.log(error)
    });
  
}

/*EmpleadoModel.sync().catch(eerror =>{
    console.log(eerror)
});*/

//sync();
app.use(authRoute);
app.use(departamentoRoute)
//sequelize.sync().then(onfulfilled =>{
    app.listen(4001);
    console.log("corriendo puerto 4001");    
//}).catch(error => {
  //  console.log(error);    
//});
