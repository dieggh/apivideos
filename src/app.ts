import { Administrador } from "./models/Administrador";
import { Persona } from "./models/Persona";
import { Usuario } from "./models/Usuario";
import { sequelize } from "./utils/database";
import { Empleado } from "./models/Empleado";
import { Departamento } from "./models/Departamento";
import { Departamento_Empleado } from "./models/Departamento_Empleado";
import path from 'path';
import { authRoute } from './routes/auth';
import { departamentoRoute } from './routes/departamento';
import { empleadoRoute } from './routes/empleado';
import { adminRouter } from './routes/admin';
import { categoriaRouter } from './routes/categoria';
import { capituloRouter } from './routes/capitulo';
import { CategoriaCapitulo } from "./models/CategoriaCapitulo";
import { Capitulo } from "./models/Capitulo";

const express = require('express');

const app = express();
app.use(express.json({ limit: '100mb' }));

app.use(express.static(path.join(__dirname, '../dist/public')));

const sync = async() =>{
    
    /*await Persona.sync({
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

    await Departamento.sync({
        force: true
    }).catch(error => {
        error
    })*/
    await Empleado.sync({force: true}).catch(error => {
        console.log(error)
    })
    await Departamento_Empleado.sync({force: true}).catch(error => {
        console.log(error)
    })

}

/*Capitulo.sync({
    force: true
}).catch(eerror =>{
    console.log(eerror)
});*/

//sync();
app.use(authRoute);
app.use(departamentoRoute);
app.use(empleadoRoute);
app.use(adminRouter);
app.use(categoriaRouter);
app.use(capituloRouter);
//sequelize.sync().then(onfulfilled =>{
    app.listen(4001);
    console.log("corriendo puerto 4001");    
//}).catch(error => {
  //  console.log(error);    
//});
