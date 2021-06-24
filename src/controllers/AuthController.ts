
import { Request, Response } from 'express';
import { Administrador } from '../models/Administrador';
import { Persona } from '../models/Persona';
import {  Usuario } from '../models/Usuario';
import { Password } from '../utils/password';
import jwt from 'jsonwebtoken';
import { Empleado } from '../models/Empleado';
import { config } from '../config/config';
import { sequelize } from '../utils/database';

interface UserPayload {
    id: number;
    nivelAcceso: number,
    email: string;
    typeUser: string;
    idKind: number;
}
interface UserRefresh {
    id: number;
    nivelAcceso: number;
}

interface refreshTokenDecoded{
    id: number;
    nivelAcceso: number;
    typeUser: string;
    idKind: number;
    iat: number;
    exp: number;
}


const postSignIn = async (req: Request, res: Response) => {
    try {

        const { password, email } = req.body;

        let idkind = null;
        let user: Usuario;

      
        const admin = await Administrador.findOne({
            attributes: ["id"],
            where:{
                estatus: '1'
            },
            include:
            {
                model: Usuario, as: 'usuario',
                attributes: ["email", "password", "nivelAcceso", "id"],
                where: {
                    'email': email
                },
            }
        });

        if (admin !== null) {
            idkind = admin.id;
            user = admin.usuario!;
        } else {
            return res.status(403).json({
                status: false,
                message: "Usuario o contraseña incorrecta",
            });
        }
        

        if (user !== null) {

            if (!await Password.compare(user.password, password)) {
                return res.status(403).json({
                    status: false,
                    message: "Usuario o contraseña incorrecta",
                    user: null
                });
            }

            const typeUser = user.nivelAcceso === 0 ? "superAdmin" :  "admin" ;

            const token = jwt.sign({ email: user.email, id: user.id, nivelAcceso: user.nivelAcceso, typeUser, idKind: idkind }, config.KEY_SECRET, { expiresIn: '8h' });


            const refreshToken = jwt.sign({ id: user.id, nivelAcceso: user.nivelAcceso }, config.KEY_SECRET, { expiresIn: '15 days' });

            user.token = refreshToken;
            await user.save();

            return res.status(200).json({
                status: true,
                message: "Autenticado Correctamente",
                user: { email: user.email, tipo: typeUser },
                token: token,
                refreshToken: refreshToken
            });

        } else {
            res.status(403).json({
                status: false,
                message: "Usuario o contraseña incorrecta",
                user: null
            });
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false
        });
    }
}

const postSignInMobile = async (req: Request, res: Response) => {
    try {

        const { password, email } = req.body;

        let idkind = null;
        let user: Usuario;

      
        const emp = await Empleado.findOne({
            attributes: ["id"],
            where:{
                estatus: '1'
            },
            include:
            {
                model: Usuario, as: 'usuario',
                attributes: ["email", "password", "nivelAcceso", "id"],
                where: {
                    'email': email
                },
            }
        });

        if (emp === null) {
            return res.status(403).json({
                status: false,
                message: "Usuario o contraseña incorrecta",
            });
        }else{
            user = emp.usuario!;
            idkind = emp.id;
        }
        
            if (!await Password.compare(user.password, password)) {
                return res.status(403).json({
                    status: false,
                    message: "Usuario o contraseña incorrecta",
                    user: null
                });
            }

            const typeUser = "empleado";

            const token = jwt.sign({ email: user.email, id: user.id, nivelAcceso: user.nivelAcceso, typeUser, idKind: idkind }, config.KEY_SECRET, { expiresIn: '12h' });


            const refreshToken = jwt.sign({ id: user.id, nivelAcceso: user.nivelAcceso }, config.KEY_SECRET, { expiresIn: '30 days' });

            user.token = refreshToken;
            await user.save();

            return res.status(200).json({
                status: true,
                message: "Autenticado Correctamente",
                user: { email: user.email, tipo: typeUser },
                token: token,
                refreshToken: refreshToken
            });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false
        });
    }
}

const postSignUp = async (req: Request, res: Response) => {

    const t = await sequelize.transaction();
    try {

        const { nombre, primerAp, segundoAp, telefono, email, password } = req.body;

        const per = await Persona.create({
            ip: req.ip,
            nombre,
            primerAp,
            segundoAp,
            telefono
        }, {
            transaction: t
        });

        const admin = await per.createAdministrador({
            noInterno: "prueba123"
        }, {
            transaction: t
        });

        const hashedPass = await Password.toHash(password);

        await admin.createUsuario({
            email,
            nivelAcceso: 0,
            password: hashedPass,
        }, {
            transaction: t
        });

        await t.commit();
        res.status(200).json({
            status: true
        });

    } catch (error) {
        await t.rollback();
        console.log(error)
        res.status(500).json({
            status: false
        });
    }
}


const postSignUpTitular = async (req: Request, res: Response) => {

    const t = await sequelize.transaction();
    try {

        const { nombre, primerAp, segundoAp, telefono, email, password, noInterno } = req.body;

        const per = await Persona.create({
            ip: req.ip,
            nombre,
            primerAp,
            segundoAp,
            telefono
        }, {
            transaction: t
        });

        const admin = await per.createAdministrador({
            noInterno: noInterno
        }, {
            transaction: t
        });

        const hashedPass = await Password.toHash(password);

        await admin.createUsuario({
            email,
            nivelAcceso: 1,
            password: hashedPass,
        }, {
            transaction: t
        });

        await t.commit();
        res.status(200).json({
            status: true
        });

    } catch (error) {
        await t.rollback();
        console.log(error)
        res.status(500).json({
            status: false
        });
    }
}

const postRefreshToken = async (req: Request, res: Response) => {
    try {
        
        const token = req.headers.authorization?.toString();
        const refreshToken = req.headers["access-token"]?.toString();
        
        if (token && refreshToken) {

            const decodedToken = jwt.decode(token.replace("Bearer ", "")) as refreshTokenDecoded;
            
            if ( Date.now() > decodedToken.exp * 1000 ) {
                
                const payload = jwt.verify(refreshToken, config.KEY_SECRET) as UserRefresh;
                
                if(payload.id === decodedToken.id){
                    const user = await Usuario.findByPk(payload.id, {
                        attributes: ["email", "id", "nivelAcceso", "estatus", "token"],
                        include: {
                            model: payload.nivelAcceso === 0 ? Administrador : Empleado,
                            attributes: ["id"]
                        }
                    });
    
                    if (user && user.estatus === "1" ) {
                        if(user.token !== refreshToken){
                            return res.status(401).send({
                                status: false,
                                message: "Token inválido"
                            });
                        }
                        const typeUser = user.nivelAcceso === 0 ? "superAdmin" : user.nivelAcceso === 1 ? "admin" : "empleado";
                        const token = jwt.sign({ email: user.email, id: user.id, nivelAcceso: user.nivelAcceso, typeUser, idKind: user.empleado ? user.empleado.id : user.administrador?.id }, config.KEY_SECRET, { expiresIn: '12h' });
    
                        const newRefreshToken = jwt.sign({ id: user.id, nivelAcceso: user.nivelAcceso }, config.KEY_SECRET, { expiresIn: '30 days' });
    
                        return res.status(200).send({
                            status: true,
                            token: token,
                            refreshToken: newRefreshToken
    
                        })
                    } else {
                        res.status(403).json({
                            status: false,
                            message: "Usuario no Autorizado"
                        })
                    }
                }else{
                    res.status(401).json({
                        status: false,
                        message: "Token Inválido"
                    })
                }
               
            } else {
                res.status(200).json({
                    status: false,
                    message: "Token no expirado"
                })
            }

        } else {
            res.status(401).json({
                status: false,
                message: "Token no proveido"
            });
        }
    } catch (error) {
        res.status(500).json({
            status: false
        })
    }
}

export {
    postSignIn,
    postSignUp,
    postRefreshToken,
    postSignUpTitular,
    postSignInMobile
};