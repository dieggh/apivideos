"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const auth_1 = require("./routes/auth");
const departamento_1 = require("./routes/departamento");
const empleado_1 = require("./routes/empleado");
const admin_1 = require("./routes/admin");
const categoria_1 = require("./routes/categoria");
const capitulo_1 = require("./routes/capitulo");
const mobile_1 = require("./routes/mobile");
const isAuth_1 = require("./middlewares/isAuth");
const policyCapitulo_1 = require("./middlewares/policyCapitulo");
const validateRequest_1 = require("./helpers/validateRequest");
const express_validator_1 = require("express-validator");
const Departamento_Empleado_1 = require("./models/Departamento_Empleado");
const express = require('express');
const app = express();
app.use(express.json({ limit: '100mb' }));
app.use('/files/:token/:id', isAuth_1.verifyTokenFiles, [
    express_validator_1.param('id')
        .notEmpty()
        .isNumeric().withMessage("id debe de ser entero")
], validateRequest_1.validateRequest, policyCapitulo_1.policyFiles, express.static(path_1.default.join(__dirname, 'public')));
app.use(express.static(path_1.default.join(__dirname, 'public/sistema')));
const sync = () => __awaiter(void 0, void 0, void 0, function* () {
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
    yield Departamento_Empleado_1.Departamento_Empleado.sync({ force: true }).catch(error => {
        console.log(error);
    });
});
/*Capitulo.sync({
    force: true
}).catch(eerror =>{
    console.log(eerror)
});*/
//sync();
app.use(cors_1.default());
app.use(auth_1.authRoute);
app.use(departamento_1.departamentoRoute);
app.use(empleado_1.empleadoRoute);
app.use(admin_1.adminRouter);
app.use(categoria_1.categoriaRouter);
app.use(capitulo_1.capituloRouter);
app.use(cors_1.default(), mobile_1.empleadoMobileRouter);
app.get('/*', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, 'public/sistema/index.html'), function (err) {
        if (err) {
            res.status(500).send(err);
        }
    });
});
//sequelize.sync().then(onfulfilled =>{
app.listen(4001);
console.log("corriendo puerto 4001");
//}).catch(error => {
//  console.log(error);    
//});
