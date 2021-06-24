import { Request, Response } from "express"
import { Administrador } from "../models/Administrador";
import { Persona } from "../models/Persona";
import { Usuario } from "../models/Usuario";
import { sequelize } from "../utils/database";
import { Password } from "../utils/password";


const putAdministrador = async (req: Request, res: Response) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { noInterno, telefono, password, email } = req.body;

        const admin = await Administrador.findByPk(id, {transaction: t});

        if (admin) {
            admin.noInterno = noInterno;
            if (password || email) {
                const user = await admin.getUsuario();
                if (password && password.trim().length > 7) {
                    user.password = await Password.toHash(password); 
                    user.token = null;                   
                }else if(password){
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
                       
                    } else {
                        await t.rollback();
                        return res.status(400).json({
                            status: false,
                            message: "El Correo Electrónico ya está en Uso"
                        });
                    }
                }

                await user.save({ transaction: t });
            }

            const persona = await admin.getPersona({transaction: t});

            persona.telefono = telefono;
            await admin.save({transaction: t});
            await persona.save({transaction: t});
            await t.commit();
            return res.status(200).json({
                status: true
            });
        }

        res.status(400).json({
            status: false,
            message: "Administrador no existe"
        })

    } catch (error) {
        await t.rollback();
        res.status(500).json({
            status: false
        });
    }
}

const getAdministradores = async (req: Request, res: Response) => {
    
    try {        
        const { nivelAcceso } = req.currentUser!;

        if(nivelAcceso === 0){
            const admin = await Administrador.findAll({
                include: [
                    {
                        model: Persona, as: 'persona'
                    },
                    {
                        model: Usuario, as: 'usuario',
                        attributes: {
                            exclude: ["password", "token"]
                        }
                    }
                ]
            });
            res.status(200).json({
                status: true,
                administradores: admin
            })
        }else{
            res.status(403).json({
                status: false,
                message: "Acceso denegado"
            })
        }                

    } catch (error) {      
        console.log(error)  
        res.status(500).json({
            status: false
        });
    }
}

const getAdministradorById = async (req: Request, res: Response) => {
    try {
        
        const { id } = req.params;

        const admin = await Administrador.findByPk(id,{
            include:[
                {
                    model: Persona, as: 'persona'
                },
                {
                    model: Usuario, as: 'usuario',
                    attributes:{
                        exclude: ["password", "token"]
                    }
                }
            ]
        });
        
        if(admin){
            return res.status(200).json({
                status: true,
                administrador: admin
            });
        }else{
            return res.status(404).json({
                status: false,
                message: "Administrador no existe"
            });
        }

    } catch (error) {
        res.status(500).json({
            status: false
        });
    }
}

const deleteAdministrador = async ( req: Request, res: Response) => {
    try {        
        const { id } = req.params;
        const admin = await Administrador.findByPk(id);    
        if(admin){            
            admin.estatus = '0';
            const user = await admin.getUsuario();
            user.token = null;
            await user.save();
            await admin.save();
            res.status(200).json({
                status: true
            });
        }else{
            res.status(403).json({
                status: true
            });
        }        
    } catch (error) {
        res.status(500).json({
            status: false
        });
    }
}

export {
    putAdministrador,
    getAdministradores,
    getAdministradorById,
    deleteAdministrador
}