import { Request, Response } from "express";
import { Administrador } from "../models/Administrador";
import { Categoria } from "../models/Categoria";
import { Departamento_Categoria } from "../models/Departamento_Categoria";

const postCategoria = async (req: Request, res: Response) =>{
    try {        
        const { idKind } = req.currentUser!;
        const { nombre, descripcion } = req.body;

        const admin = await Administrador.findByPk(idKind, {attributes:["id", "estatus"]});

        if(admin && admin.estatus === '1'){
            const categoria = await admin.createCategoria({
                nombre: nombre,
                descripcion: descripcion,
                ip: req.ip
            });

            return res.status(200).json({
                status: true,
                categoria: categoria
            });

        }else{
            return res.status(404).json({
                status: false,
                message: "Administrador no existe"
            });
        }

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false
        });   
    }
}

const putCategoria = async (req: Request, res: Response) =>{
    try {        
       
        const { descripcion } = req.body;
        const { id } = req.params;

        const categoria = await Categoria.findByPk(id);

        if(categoria){
            
            //categoria.nombre = nombre;
            categoria.descripcion =  descripcion;
            await categoria.save();
            
            res.status(200).json({
                status: true,
                categoria: categoria
            });

        }else{
            res.status(404).json({
                status: false,
                message: "Categoria no existe"
            });
        }

        
    } catch (error) {
        res.status(500).json({
            status: false
        });   
    }
}

const getCategorias = async (req: Request, res: Response) =>{
    try {        
        const { idKind, nivelAcceso } = req.currentUser!;

        if(nivelAcceso === 0){
            const categorias = await Categoria.findAll();

            return res.status(200).json({
                status: true,
                categorias
            });
        }

        const admin = await Administrador.findByPk(idKind, {attributes:["id"]});

        if(admin){
            
            const categorias = await admin.getCategorias();
            res.status(200).json({
                status: true,
                categorias
            });

        }else{
            res.status(404).json({
                status: false,
                message: "Administrador no existe"
            });
        }

        
    } catch (error) {
        res.status(500).json({
            status: false
        });   
    }
}

const getCategoriaById = async (req: Request, res: Response) =>{
    try {                
        const { id } = req.params;

        const categoria = await Categoria.findByPk(id);

        if(categoria){          
            
            res.status(200).json({
                status: true,
                categoria
            });

        }else{
            res.status(404).json({
                status: false,
                message: "Categoria no existe"
            });
        }

        
    } catch (error) {
        res.status(500).json({
            status: false
        });   
    }
}
const deleteCategoria = async (req: Request, res: Response) =>{
    try {        
        const { id } = req.params;

        const categoria = await Categoria.findByPk(id);

        if(categoria){
            categoria.estatus = '0';
            await categoria.save();

            const asigns = await Departamento_Categoria.findAll({
                where: {
                    idCategoria: id,
                    estatus: '1'
                }
            });

            for (const asig of asigns) {
                asig.estatus = '0';
                await asig.save();
            }
           

            res.status(200).json({
                status: true
            });

        }else{
            res.status(404).json({
                status: false,
                message: "Categoría no existe"
            });
        }

        
    } catch (error) {
        res.status(500).json({
            status: false
        });   
    }
}

const pathEnableCategoria = async (req: Request, res: Response) =>{
    try {        
        const { id } = req.params;

        const categoria = await Categoria.findByPk(id);

        if(categoria){
            categoria.estatus = '1';
            await categoria.save();

            const asigns = await Departamento_Categoria.findAll({
                where: {
                    idCategoria: id,
                    estatus: '0'
                }
            });

            for (const asig of asigns) {
                asig.estatus = '1';
                await asig.save();
            }

            res.status(200).json({
                status: true
            });

        }else{
            res.status(404).json({
                status: false,
                message: "Categoría no existe"
            });
        }
        
    } catch (error) {
        res.status(500).json({
            status: false
        });   
    }
}

export {
    postCategoria,
    getCategoriaById,
    getCategorias,
    putCategoria,
    deleteCategoria,
    pathEnableCategoria
}