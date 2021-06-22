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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCapituloById = exports.putFinalizarCapitulo = exports.postIniciarCapitulo = exports.getCapitulos = exports.getPerfil = exports.postAsignarDepartamento = exports.putEmpleado = exports.deleteEmpleado = exports.getEmpleadoById = exports.getEmpleados = exports.postEmpleado = void 0;
const Administrador_1 = require("../models/Administrador");
const Capitulo_1 = require("../models/Capitulo");
const Categoria_1 = require("../models/Categoria");
const Departamento_1 = require("../models/Departamento");
const Departamento_Empleado_1 = require("../models/Departamento_Empleado");
const Empleado_1 = require("../models/Empleado");
const Empleado_Capitulo_1 = require("../models/Empleado_Capitulo");
const Persona_1 = require("../models/Persona");
const Usuario_1 = require("../models/Usuario");
const database_1 = require("../utils/database");
const password_1 = require("../utils/password");
const postEmpleado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield database_1.sequelize.transaction();
    try {
        const { nombre, primerAp, segundoAp, telefono, email, password, idDepartamento, noInterno, calle, cp, numExt, numInt, ciudad, colonia, idEstado } = req.body;
        const { idKind } = req.currentUser;
        const depar = yield Departamento_1.Departamento.findByPk(idDepartamento, { attributes: ["id"] });
        const persona = yield Persona_1.Persona.create({
            nombre: nombre,
            primerAp: primerAp,
            segundoAp: segundoAp,
            telefono: telefono,
            ip: req.ip
        }, {
            transaction: t
        });
        const empleado = yield persona.createEmpleado({
            calle: calle,
            ciudad: ciudad,
            colonia: colonia,
            cp: cp,
            numExt: numExt,
            numInt: numInt,
            noInterno: noInterno,
            idEstado: idEstado,
            idAdministrador: idKind
        }, {
            transaction: t
        });
        const hashedPass = yield password_1.Password.toHash(password);
        yield empleado.createUsuario({
            email: email,
            password: hashedPass,
            nivelAcceso: 2,
        }, {
            transaction: t
        });
        if (depar) {
            yield Departamento_Empleado_1.Departamento_Empleado.create({
                idDepartamento: depar.id,
                idEmpleado: empleado.id,
                estatus: '1',
                ip: req.ip
            }, {
                transaction: t
            });
        }
        yield t.commit();
        res.status(200).json({
            status: true
        });
    }
    catch (error) {
        yield t.rollback();
        res.status(500).json({
            status: false
        });
    }
});
exports.postEmpleado = postEmpleado;
const getEmpleados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idKind, nivelAcceso } = req.currentUser;
        if (nivelAcceso === 0) {
            const empleados = yield Empleado_1.Empleado.findAll();
            return res.status(200).json({
                status: true,
                empleados
            });
        }
        else {
            const admin = yield Administrador_1.Administrador.findByPk(idKind, { attributes: ["id", "estatus"] });
            if (admin && admin.estatus === '1') {
                const empleados = yield admin.getEmpleados({
                    include: [
                        {
                            model: Persona_1.Persona, as: 'persona',
                        }, {
                            model: Usuario_1.Usuario, as: 'usuario',
                            attributes: {
                                exclude: ["password", "token"]
                            }
                        }
                    ]
                });
                return res.status(200).json({
                    status: true,
                    empleados
                });
            }
            else {
                return res.status(401).json({
                    status: false,
                    message: "Administrador no habilitado"
                });
            }
        }
    }
    catch (error) {
        res.status(500).json({
            status: false
        });
    }
});
exports.getEmpleados = getEmpleados;
const getEmpleadoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { idKind, nivelAcceso } = req.currentUser;
        if (nivelAcceso === 0) {
            const empleado = yield Empleado_1.Empleado.findByPk(id, {
                include: [{
                        model: Persona_1.Persona, as: 'persona',
                    }, {
                        model: Usuario_1.Usuario, as: 'usuario',
                        attributes: {
                            exclude: ["password", "token"]
                        }
                    }]
            });
            return res.status(401).json({
                status: true,
                empleado: empleado
            });
        }
        else {
            const admin = yield Administrador_1.Administrador.findByPk(idKind);
            if (admin && admin.estatus === '1') {
                const empleado = yield admin.getEmpleados({
                    where: {
                        id: id
                    }
                });
                if (empleado.length > 0) {
                    return res.status(401).json({
                        status: true,
                        empleado: empleado[0]
                    });
                }
                else {
                    return res.status(404).json({
                        status: false,
                        message: "Empleado no encontrado"
                    });
                }
            }
            else {
                return res.status(401).json({
                    status: false,
                    message: "Administrador no habilitado"
                });
            }
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false
        });
    }
});
exports.getEmpleadoById = getEmpleadoById;
const putEmpleado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield database_1.sequelize.transaction();
    try {
        const { id } = req.params;
        const { nivelAcceso, idKind } = req.currentUser;
        const { numExt, numInt, calle, ciudad, cp, colonia, noInterno, idEstado, nombre, primerAp, segundoAp, telefono, password, email } = req.body;
        const empleado = yield Empleado_1.Empleado.findByPk(nivelAcceso === 2 ? idKind : id, { transaction: t });
        if (empleado) {
            if (password || email) {
                const user = yield empleado.getUsuario({
                    transaction: t
                });
                if (password && password.trim().length > 7) {
                    user.password = yield password_1.Password.toHash(password);
                    user.token = null;
                    yield user.save({ transaction: t });
                }
                else if (password) {
                    yield t.rollback();
                    return res.status(400).json({
                        status: false,
                        message: "La contraseña debe de tener al menos 8 carácteres"
                    });
                }
                if (email) {
                    if (!(/.+@.+..+/).test(email)) {
                        yield t.rollback();
                        return res.status(400).json({
                            status: false,
                            message: "Correo electrónico inválido"
                        });
                    }
                    const inUse = yield Usuario_1.Usuario.findOne({
                        where: {
                            email: email
                        }
                    });
                    if (!inUse) {
                        user.email = email;
                        yield user.save({ transaction: t });
                    }
                    else {
                        yield t.rollback();
                        return res.status(400).json({
                            status: false,
                            message: "El Correo Electrónico ya está en Uso"
                        });
                    }
                }
            }
            empleado.numExt = numExt;
            empleado.numInt = numInt;
            empleado.calle = calle;
            empleado.ciudad = ciudad;
            empleado.colonia = colonia;
            empleado.cp = cp;
            if (nivelAcceso !== 2) {
                empleado.noInterno = noInterno;
            }
            empleado.idEstado = idEstado;
            yield empleado.save({ transaction: t });
            const persona = yield empleado.getPersona({
                transaction: t
            });
            persona.nombre = nombre;
            persona.primerAp = primerAp;
            persona.segundoAp = segundoAp;
            persona.telefono = telefono;
            persona.ip = req.ip;
            yield persona.save({ transaction: t });
            yield t.commit();
            res.status(200).json({
                status: true
            });
        }
    }
    catch (error) {
        yield t.rollback();
        return res.status(500).json({
            status: false
        });
    }
});
exports.putEmpleado = putEmpleado;
const deleteEmpleado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const empleado = yield Empleado_1.Empleado.findByPk(id);
        if (empleado) {
            empleado.estatus = '0';
            const user = yield empleado.getUsuario();
            user.token = null;
            yield user.save();
            yield empleado.save();
        }
        return res.status(200).json({
            status: true
        });
    }
    catch (error) {
        return res.status(500).json({
            status: false
        });
    }
});
exports.deleteEmpleado = deleteEmpleado;
const postAsignarDepartamento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { idDepartamento } = req.body;
        const empleado = yield Empleado_1.Empleado.findByPk(idDepartamento);
        const departamento = yield Departamento_1.Departamento.findByPk(id, { attributes: ['id'] });
        if (empleado && departamento) {
            //verificamos si existen asignaciones activas
            const asignaciones = yield Departamento_Empleado_1.Departamento_Empleado.findAll({
                where: {
                    idEmpleado: id,
                    estatus: '1'
                }
            });
            //si existen las iteramos y las marcamos con estatus 2 finalizadas
            for (let asignacion of asignaciones) {
                asignacion.estatus = '2';
                yield asignacion.save();
            }
            yield Departamento_Empleado_1.Departamento_Empleado.create({
                idDepartamento: departamento.id,
                idEmpleado: parseInt(id),
                estatus: '1',
                ip: req.ip
            });
            return res.status(200).json({
                status: true
            });
        }
        else {
            return res.status(404).json({
                status: false,
                message: "Departamento / Empleado no existe"
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false
        });
    }
});
exports.postAsignarDepartamento = postAsignarDepartamento;
const getPerfil = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idKind } = req.currentUser;
        const empleado = yield Empleado_1.Empleado.findByPk(idKind, {
            include: [
                {
                    model: Persona_1.Persona, as: 'persona',
                },
                {
                    model: Usuario_1.Usuario, as: 'usuario',
                    attributes: {
                        exclude: ["password"]
                    }
                },
                {
                    model: Departamento_1.Departamento,
                    through: {
                        attributes: []
                    }
                }
            ]
        });
        return res.status(200).json({
            status: true,
            empleado: empleado
        });
    }
    catch (error) {
        return res.status(500).json({
            status: false
        });
    }
});
exports.getPerfil = getPerfil;
const getCapitulos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idKind } = req.currentUser;
        const data = yield Empleado_1.Empleado.findByPk(idKind, {
            attributes: ["id"],
            include: {
                model: Departamento_1.Departamento, as: 'Departamento',
                through: {
                    attributes: []
                },
                include: [
                    {
                        model: Categoria_1.Categoria,
                        through: {
                            attributes: []
                        },
                        include: [
                            {
                                model: Capitulo_1.Capitulo, as: 'capitulos'
                            }
                        ]
                    }
                ]
            }
        });
        return res.status(200).json({
            status: true,
            capitulos: data
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false
        });
    }
});
exports.getCapitulos = getCapitulos;
const postIniciarCapitulo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idKind } = req.currentUser;
        const { idCapitulo } = req.body;
        yield Empleado_Capitulo_1.Empleado_Capitulo.create({
            idCapitulo: idCapitulo,
            idEmpleado: idKind,
            ip: req.ip,
            fechaVista: new Date(Date.now()),
            fechaConclusion: null
        });
        res.status(200).json({
            status: true
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false
        });
    }
});
exports.postIniciarCapitulo = postIniciarCapitulo;
const putFinalizarCapitulo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idKind } = req.currentUser;
        const { idCapitulo } = req.body;
        const empCap = yield Empleado_Capitulo_1.Empleado_Capitulo.findOne({
            where: {
                idCapitulo: idCapitulo,
                idEmpleado: idKind
            }
        });
        if (empCap) {
            empCap.fechaConclusion = new Date(Date.now());
            empCap.estatus = '2';
            empCap.save();
            res.status(200).json({
                status: true
            });
        }
        else {
            res.status(404).json({
                status: false,
                message: "No se inició la vista del capítulo"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: false
        });
    }
});
exports.putFinalizarCapitulo = putFinalizarCapitulo;
const getCapituloById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const cap = yield Capitulo_1.Capitulo.findByPk(id);
        cap.path = `${process.env.SERVE_FILES}/files/${id}/${cap.path}`;
        /*enviar el archivo directamente res.status(200).sendFile( 'videos/1/cronometro4xd.mp4', {
            root: 'dist/public'
        });*/
        return res.status(200).json({
            status: true,
            url: cap.path
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false
        });
    }
});
exports.getCapituloById = getCapituloById;
