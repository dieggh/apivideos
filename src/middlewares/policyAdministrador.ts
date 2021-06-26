import { NextFunction, Request, Response } from "express"
import { Administrador } from "../models/Administrador";


const policyAdmin = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const { id } = req.params;
        const { idKind, nivelAcceso } = req.currentUser!;
        console.log(idKind);
        const admin = await Administrador.findByPk(idKind, {attributes: ["id", "estatus"]})
        
        if(admin && admin.estatus === "1"){
            if( nivelAcceso === 0){
                return next();
            }
                    
            if(parseInt(id) === idKind ){
                next();
            }else{
                res.status(403).json({
                    status: false,
                    message: "Acceso Denegado"
                });
            }
        }else{
            res.status(404).json({
                status: false,
                message: "Administrador no existe s"
            });
        }
        
                
    } catch (error) {
        res.status(404).json({
            status: false
        });
    }
}

export {
    policyAdmin
}