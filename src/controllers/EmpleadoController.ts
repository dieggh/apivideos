import { Request, Response } from "express";
import { Transaction } from "sequelize/types";
import { buildURL } from "../helpers/buildURLFile";
import { Administrador } from "../models/Administrador";
import { Capitulo } from "../models/Capitulo";
import { Categoria } from "../models/Categoria";
import { Departamento } from "../models/Departamento";
import { Departamento_Categoria } from "../models/Departamento_Categoria";
import { Departamento_Empleado } from "../models/Departamento_Empleado";
import { Empleado } from "../models/Empleado";
import { Empleado_Capitulo } from "../models/Empleado_Capitulo";
import { Estado } from "../models/Estado";
import { Persona } from "../models/Persona";
import { Usuario } from "../models/Usuario";
import { sequelize } from "../utils/database";
import { Password } from "../utils/password";

const postEmpleado = async (req: Request, res: Response) => {
    const t = await sequelize.transaction();
    try {
        const { persona: { nombre, primerAp, segundoAp, telefono }, usuario: { email, password }, idDepartamento,  noInterno,
            calle, cp, numExt, numInt, ciudad, colonia, idEstado 
        } = req.body;
        const { idKind } = req.currentUser!;

        const depar = await Departamento.findByPk(idDepartamento, { attributes: ["id", "nombre"] });
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
        const usuario = await empleado.createUsuario({
            email: email,
            password: hashedPass,
            nivelAcceso: 2,
        }, {
            transaction: t
        });

        let addDepartamento = false;
        if (depar) {
            await Departamento_Empleado.create({
                idDepartamento: depar.id,
                idEmpleado: empleado.id,
                estatus: '1',
                ip: req.ip
            }, {
                transaction: t
            });                     
            addDepartamento = true;
        }
        

        const empleadoCreated = {
            ...empleado.get( {plain: true} ),        
            Departamento: depar ? [
                {
                    id: idDepartamento,
                    nombre: depar.nombre
                }
            ] : [],
            persona:{
                ...persona.get( {plain: true} )
            },
            usuario:{
                ...usuario.get( {plain: true} ),
                password: null
            }
        }

        await t.commit();

        res.status(200).json({
            status: true,
            empleado: empleadoCreated
        });

    } catch (error) {
        console.log(error)
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
            const empleados = await Empleado.findAll({
                include:[
                    {
                        model: Usuario, as: 'usuario'
                    },
                    {
                        model: Persona, as: 'persona'
                    },
                    {
                        model: Estado, as: 'estado'
                    },
                    {
                        model: Departamento, as: 'Departamento',
                        attributes: ["nombre", "id"],
                        through:{
                            attributes: [],
                            where:{
                                estatus: '1'
                            }
                        }
                    }
                ]
            });            

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
                return res.status(403).json({
                    status: false,
                    message: "Administrador no habilitado"
                });
            }

        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false
        });
    }
}

const getEstados = async (req: Request, res: Response) => {
    try {        
        
        const estados = await Estado.findAll();

       
        return res.status(200).json({
                status: true,
                estados
            })
       

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
            return res.status(200).json({
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
                    return res.status(200).json({
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
                return res.status(403).json({
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
        const { nivelAcceso, idKind } = req.currentUser!;
        const { numExt, numInt, calle, ciudad, cp, colonia, noInterno, idEstado, idDepartamento,
            persona: { segundoAp, telefono }, usuario: { password, email } } = req.body;

        const empleado = await Empleado.findByPk(nivelAcceso === 2 ? idKind : id, { transaction: t });

        if (empleado) {
            const userUpdated = {
                id: 0,
                email: email             
            };
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

                if (email && user.email !== email) {
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
                userUpdated.email = user.email;
                userUpdated.id = user.id;
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

            await empleado.save({ transaction: t });

            const persona = await empleado.getPersona({
                transaction: t
            });

            persona.segundoAp = segundoAp;
            persona.telefono = telefono;
            persona.ip = req.ip;

            await persona.save({ transaction: t });
            
            const departamento = await Departamento.findByPk(idDepartamento);
            
            if(departamento){
                await postAsignarDepartamento(parseInt(id), req.ip, departamento, t);
            }else{
                await t.rollback();
                return res.status(404).json({status: false, message: "Departamento no Existe"});
            }

            await t.commit();

            res.status(200).json({
                status: true,
                empleado: {
                    ...empleado.get( {plain: true} ),        
                    Departamento: [
                        {
                            id: departamento.id,
                            nombre: departamento.nombre
                        }
                    ],
                    persona:{
                        ...persona.get( {plain: true} )
                    },
                    usuario:{
                        ...userUpdated,
                        password: null
                    }
                }
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

const postAsignarDepartamento = async (id: number, ip: string, departamento: Departamento, t: Transaction) => {
    try {

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
            idEmpleado: id,
            estatus: '1',
            ip: ip
        }, {transaction: t});

        return true;
            
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const getPerfil = async (req: Request, res: Response) => {
    try {
        const { idKind } = req.currentUser!;

        const empleado = await Empleado.findByPk(idKind, {
            include: [
                {
                    model: Persona, as: 'persona',
                },
                {
                    model: Usuario, as: 'usuario',
                    attributes: {
                        exclude: ["password", "token"]
                    }
                },
                {
                    model: Departamento, as: 'Departamento',
                    through: {
                        attributes: []
                    }
                }
            ]
        })

        return res.status(200).json({
            status: true,
            empleado: empleado
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false
        });
    }
}

const getCapitulos = async (req: Request, res: Response) => {
    try {
        const { idKind } = req.currentUser!;

        const data = await Empleado.findByPk(idKind, {
            attributes: ["id"],
            include: {
                model: Departamento, as: 'Departamento',
                attributes: {
                    exclude: ["createdAt", "updatedAt", "ip"]
                },
                through: {
                    attributes: []
                },
                include: [
                    {
                        model: Categoria,
                        through: {
                            attributes: []
                        },
                        where:{
                            estatus: '1'
                        },
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "ip"]
                        },
                        include: [
                            {
                                model: Capitulo, as: 'capitulos',
                                attributes: {
                                    exclude: ["createdAt", "updatedAt", "ip"]
                                },
                                where:{
                                    estatus: '1'
                                },
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

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false
        });
    }
}

const postIniciarCapitulo = async (req: Request, res: Response) => {

    try {
        const { idKind } = req.currentUser!;
        const { idCapitulo } = req.body;

        await Empleado_Capitulo.create({
            idCapitulo: idCapitulo,
            idEmpleado: idKind,
            ip: req.ip,
            fechaVista: new Date(Date.now()),
            fechaConclusion: null
        });

        res.status(200).json({
            status: true
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false
        });
    }

}

const putFinalizarCapitulo = async (req: Request, res: Response) => {
    try {
        const { idKind } = req.currentUser!;
        const { idCapitulo } = req.body;

        const empCap = await Empleado_Capitulo.findOne({
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
        } else {
            res.status(404).json({
                status: false,
                message: "No se inició la vista del capítulo"
            });
        }

    } catch (error) {
        res.status(500).json({
            status: false
        });

    }
}

const getCapituloById = async (req: Request, res: Response) => {
    try {
        const { nivelAcceso, idKind } = req.currentUser!;
        const { id } = req.params;

        const cap = await Capitulo.findByPk(id);
    
        cap!.path = `${process.env.SERVE_FILES!}/files/${id}/${cap!.path}`;
        if(cap){
            buildURL([cap], idKind, nivelAcceso );            
            return res.status(200).json({
                status: true,
                url: cap.path
            });
        }else{
            return res.status(404).json({
                status: false,
                message: "Capítulo no Existe"
            });
        }
        
        /*enviar el archivo directamente res.status(200).sendFile( 'videos/1/cronometro4xd.mp4', {
            root: 'dist/public'
        });*/

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false
        });
    }
}

const patchEnableEmpleado = async (req: Request, res: Response) => {
    
    try {
        const { id } = req.params;        

        const empleado = await Empleado.findByPk(id);

        if (empleado) {
            empleado.estatus = '1';
            await empleado.save();                       
            return res.status(200).json({
                status: true                
            });
        }

        res.status(400).json({
            status: false,
            message: "Empleado no existe"
        })

    } catch (error) {
        
        res.status(500).json({
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
    postAsignarDepartamento,
    getPerfil,
    getCapitulos,
    postIniciarCapitulo,
    putFinalizarCapitulo,
    getCapituloById,
    getEstados,
    patchEnableEmpleado
}