import { NextFunction, Request, Response } from "express"
import { Administrador } from "../models/Administrador";

const policyCategoria = async(req: Request, res: Response, next: NextFunction) =>{
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

            const categoria = await admin.getCategorias({
                where:{
                    id: id
                }
            });
            if(categoria.length > 0 ){
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
        res.status(404).json({
            status: false
        });
    }
}

export {
    policyCategoria
}