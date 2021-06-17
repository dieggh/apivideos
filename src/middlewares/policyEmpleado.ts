import { NextFunction, Request, Response } from "express"
import { Administrador } from "../models/Administrador";
import { Empleado } from "../models/Empleado";

const policyEmpleado = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const { id } = req.params;
        const { idKind, nivelAcceso } = req.currentUser!;
        
        const emp = await Empleado.findByPk(id, {
            attributes: ["idAdministrador"],
            include: {
                model: Administrador, as: 'administrador',
                attributes: ["id", "estatus"]
            }
        });
        
        if(emp){

            if(emp.administrador?.estatus === '0'){
                return res.status(401).json({
                    status: false,
                    message: "Acceso Denegado"
                })
            }
            
            if(nivelAcceso === 0){
                return next();
            }

            if(emp.idAdministrador === idKind ){
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
                message: "Empleado no encontrado"
            });
        }                
    } catch (error) {
        res.status(404).json({
            status: false
        });
    }
}

export {
    policyEmpleado
}