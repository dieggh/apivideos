import { Request, Response } from "express";
import { Capitulo } from "../models/Capitulo";
import { Categoria } from "../models/Categoria";
import { saveFiles } from "../utils/base64";

const postCapitulo = async (req: Request, res: Response) => {
    try {
        const { nombre, descripcion, tipo, duracion, idCategoria, file } = req.body;

        const categoria = await Categoria.findByPk(idCategoria, {
            attributes: ["id"]
        }
        );

        if (categoria) {

            const cap = await categoria.createCapitulo({
                nombre: nombre,
                descripcion: descripcion,
                tipo: tipo,
                path: 'somepath',
                duracion: duracion,
                ip: req.ip
            });

            const directory = `${process.env.FILES_PATH!}/videos/${cap.id}`;
            const path = await saveFiles(file.base64, file.fileName, file.ext, directory);
            if (path) {
                cap.path = path;
                await cap.save();
            }

            res.status(200).json({
                status: true
            });

        } else {
            res.status(404).json({
                status: false,
                message: "Categoria no existe"
            });
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false
        });
    }
}

const putCapitulo = async (req: Request, res: Response) => {
    try {

        const { nombre, descripcion, tipo, duracion, idCategoria, file } = req.body;
        const { id } = req.params;


        const cap = await Capitulo.findByPk(id);

        if (cap) {

            if (idCategoria) {
                const categoria = await Categoria.findByPk(idCategoria);
                if (categoria) {
                    await cap.setCategoria(categoria);
                    //console.log(cap2)
                } else {
                    return res.status(404).json({
                        status: false,
                        message: "Categoria no Existe"
                    });
                }
            }

            cap.nombre = nombre;
            cap.descripcion = descripcion;
            cap.tipo = tipo;
            cap.duracion = duracion;
            
            if (file) {
                const directory =  `${process.env.FILES_PATH!}/videos/${cap.id}`;
                const path = await saveFiles(file.base64, file.fileName, file.ext, directory, cap.path);
                if (path) {
                    cap.path = path;
                }
            }

            await cap.save();

            res.status(200).json({
                status: true
            });

        } else {
            res.status(404).json({
                status: false,
                message: "Capitulo no existe"
            });
        }

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: false
        });
    }
}

const getCapitulos = async (req: Request, res: Response) => {
    try {
        const { idKind, nivelAcceso } = req.currentUser!;

        if (nivelAcceso === 0) {
            const capitulos = await Capitulo.findAll({
                include: {
                    model: Categoria, as: 'categoria',
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "ip"]
                    }
                }
            });

            return res.status(200).json({
                status: true,
                capitulos
            });
        }else{
            const capitulos = await Capitulo.findAll({
                include: {
                    model: Categoria, as: 'categoria',
                    where: {
                        idAdministrador: idKind
                    }
                }
            });
    
            res.status(200).json({
                status: true,
                capitulos
            });   
        }

    } catch (error) {
        res.status(500).json({
            status: false
        });
    }
}

const getCapitulosById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const capitulo = await Capitulo.findByPk(id,{
            include : {
                model: Categoria, as: 'categoria',
                attributes: {
                    exclude: ["createdAt", "updatedAt", "ip"]
                }
            }
        });

        if (capitulo) {

            res.status(200).json({
                status: true,
                capitulo
            });

        } else {
            res.status(404).json({
                status: false,
                message: "Capitulo no existe"
            });
        }


    } catch (error) {
        res.status(500).json({
            status: false
        });
    }
}

const deleteCapitulo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const capitulo = await Capitulo.findByPk(id);

        if (capitulo) {
            capitulo.estatus = '0';
            await capitulo.save();

            res.status(200).json({
                status: true
            });

        } else {
            res.status(404).json({
                status: false,
                message: "Capítulo no existe"
            });
        }


    } catch (error) {
        res.status(500).json({
            status: false
        });
    }
}

export {
    postCapitulo,
    getCapitulos,
    getCapitulosById,
    putCapitulo,
    deleteCapitulo
}