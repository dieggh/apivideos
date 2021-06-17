import { Request, Response } from "express";
import { Administrador } from "../models/Administrador";
import { Departamento } from "../models/Departamento";
import { Departamento_Empleado } from "../models/Departamento_Empleado";
import { Empleado } from "../models/Empleado";
import { Persona } from "../models/Persona";
import { Usuario } from "../models/Usuario";
import { sequelize } from "../utils/database";
import { Password } from "../utils/password";

const postEmpleado = async (req: Request, res: Response) => {
    const t = await sequelize.transaction();
    try {
        const { nombre, primerAp, segundoAp, telefono, email, password, idDepartamento, noInterno,
            calle, cp, numExt, numInt, ciudad, colonia, idEstado
        } = req.body;
        const { idKind } = req.currentUser!;

        const depar = await Departamento.findByPk(idDepartamento, { attributes: ["id"] });
        const persona = await Persona.create({
            nombre: nombre,
            primerAp: primerAp,
            segundoAp: segundoAp,
            telefono: telefono,
            ip: req.ip
        }, {
            transaction: t
        });

        const empleado = await persona.createEmpleado({
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

        const hashedPass = await Password.toHash(password);
        await empleado.createUsuario({
            email: email,
            password: hashedPass,
            nivelAcceso: 0,
        }, {
            transaction: t
        });

        if (depar) {
            await Departamento_Empleado.create({
                idDepartamento: depar.id,
                idEmpleado: empleado.id,
                estatus: '1',
                ip: req.ip
            }, {
                transaction: t
            });
        }

        await t.commit();

        res.status(200).json({
            status: true
        });

    } catch (error) {
        await t.rollback();
        res.status(500).json({
            status: false
        });
    }
}

const getEmpleados = async (req: Request, res: Response) => {
    try {
        const { idKind, nivelAcceso } = req.currentUser!;
        if (nivelAcceso === 0) {
            const empleados = await Empleado.findAll();

            return res.status(200).json({
                status: true,
                empleados
            });
        } else {
            const admin = await Administrador.findByPk(idKind, { attributes: ["id", "estatus"] });

            if (admin && admin.estatus === '1') {
                const empleados = await admin.getEmpleados({
                    include: [
                        {
                            model: Persona, as: 'persona',
                        }, {
                            model: Usuario, as: 'usuario',
                            attributes: {
                                exclude: ["password", "token"]
                            }
                        }]
                });
                return res.status(200).json({
                    status: true,
                    empleados
                });
            } else {
                return res.status(401).json({
                    status: false,
                    message: "Administrador no habilitado"
                });
            }

        }

    } catch (error) {
        res.status(500).json({
            status: false
        });
    }
}

const getEmpleadoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { idKind, nivelAcceso } = req.currentUser!;

        if (nivelAcceso === 0) {
            const empleado = await Empleado.findByPk(id, {
                include: [{
                    model: Persona, as: 'persona',
                }, {
                    model: Usuario, as: 'usuario',
                    attributes: {
                        exclude: ["password", "token"]
                    }
                }]
            });
            return res.status(401).json({
                status: true,
                empleado: empleado
            });
        } else {

            const admin = await Administrador.findByPk(idKind);

            if (admin && admin.estatus === '1') {
                const empleado = await admin.getEmpleados({
                    where: {
                        id: id
                    }
                });

                if (empleado.length > 0) {
                    return res.status(401).json({
                        status: true,
                        empleado: empleado[0]
                    });
                } else {
                    return res.status(404).json({
                        status: false,
                        message: "Empleado no encontrado"
                    });
                }

            } else {
                return res.status(401).json({
                    status: false,
                    message: "Administrador no habilitado"
                });
            }
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false
        });
    }
}

const putEmpleado = async (req: Request, res: Response) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { numExt, numInt, calle, ciudad, cp, colonia, noInterno, idEstado,
            nombre, primerAp, segundoAp, telefono, password, email } = req.body;

        const empleado = await Empleado.findByPk(id, { transaction: t });

        if (empleado) {

            if (password || email) {

                const user = await empleado.getUsuario({
                    transaction: t
                });

                if (password && password.trim().length > 7) {
                    user.password = await Password.toHash(password);
                    user.token = null;
                    await user.save({ transaction: t });
                } else if (password) {
                    await t.rollback();
                    return res.status(400).json({
                        status: false,
                        message: "La contraseña debe de tener al menos 8 carácteres"
                    });
                }

                if (email) {
                    if (!(/.+@.+..+/).test(email)) {
                        await t.rollback();
                        return res.status(400).json({
                            status: false,
                            message: "Correo electrónico inválido"
                        });
                    }
                    const inUse = await Usuario.findOne({
                        where: {
                            email: email
                        }
                    });

                    if (!inUse) {
                        user.email = email;
                        await user.save({ transaction: t });
                    } else {
                        await t.rollback();
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
            empleado.noInterno = noInterno;
            empleado.idEstado = idEstado;

            await empleado.save({ transaction: t });

            const persona = await empleado.getPersona({
                transaction: t
            });

            persona.nombre = nombre;
            persona.primerAp = primerAp;
            persona.segundoAp = segundoAp;
            persona.telefono = telefono;
            persona.ip = req.ip;

            await persona.save({ transaction: t });

            await t.commit();

            res.status(200).json({
                status: true
            });
        }

    } catch (error) {
        await t.rollback();
        return res.status(500).json({
            status: false
        });
    }
}

const deleteEmpleado = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        const empleado = await Empleado.findByPk(id);

        if (empleado) {
            empleado.estatus = '0';
            const user = await empleado.getUsuario();
            user.token = null;
            await user.save();
            await empleado.save();
        }

        return res.status(200).json({
            status: true
        });
    } catch (error) {
        return res.status(500).json({
            status: false
        });
    }
}

const postAsignarDepartamento = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        const { idDepartamento } = req.body;

        const empleado = await Empleado.findByPk(idDepartamento);
        const departamento = await Departamento.findByPk(id, { attributes: ['id'] });

        if (empleado && departamento) {
            //verificamos si existen asignaciones activas
            const asignaciones = await Departamento_Empleado.findAll({
                where: {
                    idEmpleado: id,
                    estatus: '1'
                }
            });
            //si existen las iteramos y las marcamos con estatus 2 finalizadas
            for (let asignacion of asignaciones) {
                asignacion.estatus = '2'
                await asignacion.save();
            }

            await Departamento_Empleado.create({
                idDepartamento: departamento.id,
                idEmpleado: parseInt(id),
                estatus: '1',
                ip: req.ip
            });

            return res.status(200).json({
                status: true
            });
        } else {
            return res.status(404).json({
                status: false,
                message: "Departamento / Empleado no existe"
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: false
        });
    }
}


export {
    postEmpleado,
    getEmpleados,
    getEmpleadoById,
    deleteEmpleado,
    putEmpleado,
    postAsignarDepartamento
}