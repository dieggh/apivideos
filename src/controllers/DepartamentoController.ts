import { Request, Response } from "express";
import { Administrador } from "../models/Administrador";
import { Departamento } from "../models/Departamento";

const postDepartamento = async (req: Request, res: Response) =>{
    try {        
        const { nombre, descripcion } = req.body;
        const { idKind } = req.currentUser!;                

        const admin = await Administrador.findByPk(idKind, { attributes:["id", "estatus"] } );
        if(admin && admin.estatus === '1'){
            admin.createDepartamento({
                nombre,
                descripcion,
                ip: req.ip
            });
            return res.status(200).json({
                status: true
            })
        }
        
        res.status(404).json({
            status: false,
            message: "El administrador no existe"
        });

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
        if(admin){
            const departamentos = await admin.getDepartamentos();
            res.status(200).json({
                status: true,
                departamentos
            });
        }else{
            res.status(404).json({
                status: false,
                message: "El administrador no existe"
            })
        }
                
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false
        })
    }
}

const getDepartamentoById = async(req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { idKind } = req.currentUser!;        
        const admin = await  Administrador.findByPk(idKind);

        if(admin){
            const departamento = await admin.getDepartamentos({
                where:{
                    id: id
                }
            });     
            
            if(departamento.length > 0){
                res.status(200).json({
                    status: true,
                    departamento: departamento[0] 
                });
            }else{
                res.status(404).json({
                    status: false,
                    message: "Departamento no existe"
                });
            }
            
        }else{
            res.status(404).json({
                status: false,
                message: "El administrador no existe"
            });
        }
                
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false
        })
    }
}

const putDepartamento = async(req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const departamento = await Departamento.findByPk(id);
    
        if(departamento){
            departamento.nombre = nombre;
            departamento.descripcion = descripcion;
            await departamento.save();
            return res.status(200).json({
                status: true
            });
        }

        res.status(404).json({
            status: false,
            message: "Departamento no Existe"
        });

    } catch (error) {
        res.status(500).json({
            status: false
        });
    }
}

const deleteDepartamento = async(req: Request, res: Response ) => {
    try {
        const { id } = req.params;        

        const departamento = await Departamento.findByPk(id);
        
        if(departamento){
            departamento.estatus = '0';
            await departamento.save();
            
            return res.status(200).json({
                status: true
            });
        }

        return res.status(404).json({
            status: false,
            message: "Departamento no Existe"
        });

    } catch (error) {
        res.status(500).json({
            status: false
        });
    }
}
export { getDepartamento, postDepartamento, getDepartamentoById, putDepartamento, deleteDepartamento };