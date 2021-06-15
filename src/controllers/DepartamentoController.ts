import { Request, Response } from "express";
import { Administrador } from "../models/Administrador";
import { Departamento } from "../models/Departamento";

const postDepartamento = (req: Request, res: Response) =>{
    try {
        
        const { } = req.body;



    } catch (error) {
        res.status(500).json({
            status: false
        })
    }
}

const getDepartamento = async (req: Request, res: Response) =>{
    try {
        
        const { idKind } = req.currentUser!;

        const admin = await  Administrador.findByPk(idKind);
        const departamentos = await admin?.getDepartamentos();

        res.status(200).json({
            status: true,
            departamentos
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false
        })
    }
}

export { getDepartamento, postDepartamento };