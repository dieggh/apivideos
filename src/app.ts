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
import { verifyToken, verifyTokenFiles } from "./middlewares/isAuth";
import { policyEmpleadoCapitulo, policyFiles } from "./middlewares/policyCapitulo";
import { validateRequest } from "./helpers/validateRequest";
import { param } from "express-validator";
import { Departamento_Empleado } from "./models/Departamento_Empleado";
import { Departamento_Categoria } from "./models/Departamento_Categoria";
import { Estado } from "./models/Estado";
import { Request, Response } from "express";


const express = require('express');

const app = express();
app.use(express.json({ limit: '100mb' }));

app.use('/files/:token/:id',
    verifyTokenFiles,
    [
        param('id')
            .notEmpty()
            .isNumeric().withMessage("id debe de ser entero")
    ],
    validateRequest,
    policyFiles,
    express.static(path.join(__dirname, 'public'))
);

app.use(express.static(path.join(__dirname, 'public/sistema')));

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

    await Departamento_Empleado.sync({force: true}).catch(error =>{
        console.log(error)
    })

}

/*Capitulo.sync({
    force: true
}).catch(eerror =>{
    console.log(eerror)
});*/
//sync();
app.use(cors());
app.use(authRoute);
app.use(departamentoRoute);
app.use(empleadoRoute);
app.use(adminRouter);
app.use(categoriaRouter);
app.use(capituloRouter);
app.use(cors(), empleadoMobileRouter);

app.get('/*', function (req: Request, res: Response) {
    
    res.sendFile(path.join(__dirname, 'public/sistema/index.html'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
    });
});
//sequelize.sync().then(onfulfilled =>{
app.listen(4001);
console.log("corriendo puerto 4001");
//}).catch(error => {
  //  console.log(error);    
//});
