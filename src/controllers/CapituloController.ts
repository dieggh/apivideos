import { Request, Response } from "express";
import { Capitulo } from "../models/Capitulo";
import { CategoriaCapitulo } from "../models/CategoriaCapitulo";
import { saveFiles } from "../utils/base64";

const postCapitulo = async (req: Request, res: Response) => {
    try {
        const { nombre, descripcion, tipo, duracion, idCategoria, file } = req.body;

        const categoria = await CategoriaCapitulo.findByPk(idCategoria, {
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

            const directory = `dist/public/videos/${cap.id}`;
            const path = await saveFiles(file.base64, file.fileName, file.ext, directory);

            cap.path = path;
            await cap.save();

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

        const { nombre, descripcion } = req.body;
        const { id } = req.params;

        const categoria = await CategoriaCapitulo.findByPk(id);

        if (categoria) {

            categoria.nombre = nombre;
            categoria.descripcion = descripcion;
            await categoria.save();

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
                    model: CategoriaCapitulo, as: 'categoria'
                }
            });

            return res.status(200).json({
                status: true,
                capitulos
            });
        }

        const capitulos = await Capitulo.findAll({
            include: {
                model: CategoriaCapitulo, as: 'categoria',
                where: {
                    idAdministrador: idKind
                }
            }
        });

        res.status(200).json({
            status: true,
            capitulos
        });



    } catch (error) {
        res.status(500).json({
            status: false
        });
    }
}

const getCapitulosById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const capitulo = await Capitulo.findByPk(id);

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