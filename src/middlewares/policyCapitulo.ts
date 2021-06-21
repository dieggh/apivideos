import { NextFunction, Request, Response } from "express"
import { Administrador } from "../models/Administrador";
import { Capitulo } from "../models/Capitulo";
import { Categoria } from "../models/Categoria";
import { Departamento } from "../models/Departamento";
import { Empleado } from "../models/Empleado";

const policyCapitulo = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const { id } = req.params;
        const { idKind, nivelAcceso } = req.currentUser!;

        const admin = await Administrador.findByPk(idKind, { attributes: ["id", "estatus"]});
                            
        if(admin){

            if( admin.estatus !== '1'){
                return res.status(401).json({
                    status: false,
                    message: "Acceso denegado"
                });
            }

            if(nivelAcceso === 0){
                return next();
            }
            
            const cap = await Capitulo.findByPk(id,{
                include:{
                    model: Categoria, as: 'categoria',
                    where:{
                        idAdministrador: idKind
                    }
                }
            });

            if(cap){
                next();
            }else{
                res.status(401).json({
                    status: false,
                    message: "Acceso no Autorizado"
                });
            }
        }else{
            res.status(404).json({
                status: false,
                message: "Administrador no encontrado"
            });
        }                
    } catch (error) {
        res.status(500).json({
            status: false
        });
    }
}

const policyEmpleadoCapitulo = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { idKind } = req.currentUser!;
        const { idCapitulo } = req.body;
        const { id } = req.params;
        console.log(id);
        const hasRight = await Capitulo.findOne({
            where:{
                id : idCapitulo ? idCapitulo : id
            },
            include:[
                {
                    model: Categoria, as: 'categoria',
                    include: [
                        {
                            model: Departamento,
                            include:[
                                {
                                    model: Empleado, as: 'Empleados', 
                                    where:{
                                        id: idKind
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if(hasRight){
            if(hasRight.categoria?.Departamentos){
                if(hasRight.categoria?.Departamentos.length > 0){
                    if(hasRight.categoria.Departamentos[0].Empleados!.length > 0){
                        return next();
                    }
                }                
            }
            
            return res.status(401).json({
                status: false,
                message: "Acceso denegado"
            });
        }else{
            res.status(401).json({
                status: false,
                message: "Acceso denegado"
            });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false
        });
    }
}

export {
    policyCapitulo,
    policyEmpleadoCapitulo
}