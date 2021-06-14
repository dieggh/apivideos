
import { Request, Response } from 'express';
import { Administrador } from '../models/Administrador';
import { Persona } from '../models/Persona';
import { UsuarioAttributes, Usuario } from '../models/Usuario';
import { Password } from '../utils/password';
import jwt from 'jsonwebtoken';
import { Empleado } from '../models/Empleado';
import { config } from '../config/config';
import { sequelize } from '../utils/database';

const postSignIn = async (req: Request, res: Response) => {
    try {

        const { password, email } = req.body;       

       const empleado = await Empleado.findOne({
            attributes: ["id"],
            include:
            {
                model: Usuario, as: 'usuario',
                attributes: ["email", "password", "nivelAcceso"],
                where: {
                    'email': email
                },
            }
        });

           
        let idkind = null;
        let user: Usuario;

        if (empleado !== null) {
            idkind = empleado.id;
            user = empleado.usuario!;
        }else{
            const admin = await Administrador.findOne({
                attributes: ["id"],
                include: 
                    {
                        model: Usuario, as: 'usuario',
                        attributes: ["email", "password", "nivelAcceso"],
                        where: {
                            'email': email
                        },
                    }
            });

            if(admin !== null){
                idkind = admin.id;
                user = admin.usuario!;
            }else{
                return res.status(401).json({
                    status: false,
                    message: "Usuario o contraseña incorrecta",
                });
            }      
        }

        if (user !== null) {

            if (!await Password.compare(user.password, password)) {
                return res.status(401).json({
                    status: false,
                    message: "Usuario o contraseña incorrecta",
                    user: null
                });
            }
            
            const typeUser = user.nivelAcceso === 0 ? "superAdmin" : user.nivelAcceso === 1 ? "admin" : "empleado";

            const token = jwt.sign({ email: user.email, id: user.id, nivelAcceso: user.nivelAcceso, typeUser, idKind: idkind }, config.keySecret, { expiresIn: '3h' });

            return res.status(200).json({
                status: true,
                message: "Autenticado Correctamente",
                user: { email: user.email, tipo: typeUser  },
                token: token
            });

        } else {
            res.status(401).json({
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
        },{
            transaction: t
        });

        const admin = await per.createAdministrador({
            noInterno: "prueba123"
        },{
            transaction: t
        });

        const hashedPass = await Password.toHash(password);

        await admin.createUsuario({
            email,
            nivelAcceso: 0,
            password: hashedPass,
        },{
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

const postSignUpEmpleado = () => {

}

export {
    postSignIn,
    postSignUp,
    postSignUpEmpleado
};