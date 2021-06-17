import { Request, Response } from "express";
import { Administrador } from "../models/Administrador";
import { CategoriaCapitulo } from "../models/CategoriaCapitulo";

const postCategoria = async (req: Request, res: Response) =>{
    try {        
        const { idKind } = req.currentUser!;
        const { nombre, descripcion } = req.body;

        const admin = await Administrador.findByPk(idKind, {attributes:["id", "estatus"]});

        if(admin && admin.estatus === '1'){
            await admin.createCategoria({
                nombre: nombre,
                descripcion: descripcion,
                ip: req.ip
            });

            res.status(200).json({
                status: true
            });

        }else{
            res.status(404).json({
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
       
        const { nombre, descripcion } = req.body;
        const { id } = req.params;

        const categoria = await CategoriaCapitulo.findByPk(id);

        if(categoria){
            
            categoria.nombre = nombre;
            categoria.descripcion =  descripcion;
            await categoria.save();
            
            res.status(200).json({
                status: true
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
            const categorias = await CategoriaCapitulo.findAll();

            res.status(200).json({
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

        const categoria = await CategoriaCapitulo.findByPk(id);

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

        const categoria = await CategoriaCapitulo.findByPk(id);

        if(categoria){
            categoria.estatus = '0';
            await categoria.save();

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
    deleteCategoria
}