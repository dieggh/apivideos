import { NextFunction, Request, Response } from "express"
import { Administrador } from "../models/Administrador";

const policyDepartamento = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const { id } = req.params;
        const { idKind, nivelAcceso } = req.currentUser!;

        const admin = await Administrador.findByPk(idKind,{ attributes: ["id", "estatus"]});
                            
        if(admin && admin.estatus === '1'){

            if(nivelAcceso === 0){
                return next();
            }  

            const depar = await admin.getDepartamentos({
                where:{
                    id: id
                }
            })
            if(depar.length > 0 ){
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
        res.status(404).json({
            status: false
        });
    }
}

export {
    policyDepartamento
}