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
                return res.status(403).json({
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
                res.status(403).json({
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
        const { idKind, nivelAcceso } = req.currentUser!;
        const { idCapitulo } = req.body;
        const { id } = req.params;
        console.log(req.path)
        /*if(nivelAcceso === 0 && req.path.includes('videos')){
            return next();
        }*/

        const hasRight = await Capitulo.findOne({
            attributes: ["id"],
            where:{
                id : idCapitulo ? idCapitulo : id
            },
            include:[
                {
                    model: Categoria, as: 'categoria',
                    attributes: ["id"],              
                    include: [
                        {
                            model: Departamento,
                            attributes: ["id"],
                            through: {
                                attributes: ["idDepartamento", "idCategoria"]
                            },
                            include:[
                                {
                                    model: Empleado, as: 'Empleados', 
                                    through: {
                                        attributes: ["idDepartamento", "idEmpleado"]
                                    },
                                    where:{
                                        id: 2
                                    },
                                    attributes: ["id"]
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
            
            return res.status(403).json({
                status: false,
                message: "Acceso denegado"
            });
        }else{
            res.status(403).json({
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