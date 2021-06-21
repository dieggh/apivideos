import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';
import path from 'path';
import { authRoute } from './routes/auth';
import { departamentoRoute } from './routes/departamento';
import { empleadoRoute } from './routes/empleado';
import { adminRouter } from './routes/admin';
import { categoriaRouter } from './routes/categoria';
import { capituloRouter } from './routes/capitulo';
import { empleadoMobileRouter } from './routes/mobile';
import { Empleado_Capitulo } from "./models/Empleado_Capitulo";
import { isAuthEmployer } from "./middlewares/isAuth";
import { policyEmpleadoCapitulo } from "./middlewares/policyCapitulo";
import { validateRequest } from "./helpers/validateRequest";
import { param } from "express-validator";


const express = require('express');

const app = express();
app.use(express.json({ limit: '100mb' }));

app.use('/files/:id',
    isAuthEmployer,
    [
        param('id')
            .notEmpty()
            .isNumeric().withMessage("id debe de ser entero")
    ],
    validateRequest,
    policyEmpleadoCapitulo,
    express.static(path.join(__dirname, '../dist/public'))
);

const sync = async () => {

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

    await Empleado_Capitulo.sync({ force: true }).catch(error => {
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
app.use(cors(), empleadoMobileRouter);
//sequelize.sync().then(onfulfilled =>{
app.listen(4001);
console.log("corriendo puerto 4001");
//}).catch(error => {
  //  console.log(error);    
//});
