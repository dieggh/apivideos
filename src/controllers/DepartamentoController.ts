import { Request, Response } from "express";
import { Administrador } from "../models/Administrador";
import { Categoria } from "../models/Categoria";
import { Departamento } from "../models/Departamento";
import { Departamento_Categoria } from "../models/Departamento_Categoria";
import { Departamento_Empleado } from "../models/Departamento_Empleado";
import { Empleado } from "../models/Empleado";
import { Persona } from "../models/Persona";

const postDepartamento = async (req: Request, res: Response) => {
    try {
        const { nombre, descripcion, categorias } = req.body;
        const { idKind } = req.currentUser!;

        const admin = await Administrador.findByPk(idKind, { attributes: ["id", "estatus"] });
        if (admin && admin.estatus === '1') {
            const departamento = await admin.createDepartamento({
                nombre,
                descripcion,
                ip: req.ip
            });

            if(categorias){
                for (const categoria of categorias) {
                    await Departamento_Categoria.create({
                        idDepartamento: departamento.id,
                        idCategoria: categoria.id,                        
                        ip: req.ip
                    });
                }
            }

            return res.status(200).json({
                status: true,
                departamento
            })
        }

        res.status(404).json({
            status: false,
            message: "El administrador no existe"
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false
        })
    }
}

const getDepartamento = async (req: Request, res: Response) => {
    try {

        const { idKind, nivelAcceso } = req.currentUser!;
        if (nivelAcceso === 0) {
            
            const departamentos = await Departamento.findAll();
            
            return res.status(200).json({
                status: true,
                departamentos
            });

        } else {
            
            const admin = await Administrador.findByPk(idKind);
            
            if (admin) {
                const departamentos = await admin.getDepartamentos();
                return res.status(200).json({
                    status: true,
                    departamentos
                });
            } else {
                return res.status(404).json({
                    status: false,
                    message: "El administrador no existe"
                })
            }
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false
        })
    }
}

const getDepartamentoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const departamento = await Departamento.findByPk(id);

        if (departamento) {
            res.status(200).json({
                status: true,
                departamento: departamento
            });
        } else {
            res.status(404).json({
                status: false,
                message: "Departamento no existe"
            });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false
        })
    }
}

const getDepartamentoCategorias = async (req: Request, res: Response) =>{
    try {
        const { id } = req.params;
        const categorias = await Categoria.findAll({
            where:{              
                estatus: '1'
            },            
            attributes: ["id", "nombre"],
            include: {
                model: Departamento,
                attributes: ['id'],
                where:{
                    id: id
                },
                through:{
                    attributes: [],
                    where:{
                        estatus: '1'
                    }
                }
            }
        });
        
        return res.status(200).json({
            status: true,
            categorias
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false            
        });
    }
}

const getDepartamentoEmpleados = async (req: Request, res: Response) =>{
    try {
        const { id } = req.params;
        const empleados = await Empleado.findAll({
            where:{              
                estatus: '1'
            },            
            attributes: ["id", "noInterno"],
            include: [
                {
                    model: Departamento,
                    as: 'Departamento',
                    attributes: ['id'],
                    where:{
                        id: id
                    },
                    through:{
                        attributes: ["id"],
                        where:{
                            estatus: '1'
                        }
                    }
                },
                {
                    model: Persona, as: 'persona',
                    attributes: ["nombre", "primerAp", "segundoAp"]
                }
            ]
        });
        
        return res.status(200).json({
            status: true,
            empleados
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false            
        });
    }
}

const putDepartamento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, categorias } = req.body;

        const departamento = await Departamento.findByPk(id);

        if (departamento) {
            departamento.nombre = nombre;
            departamento.descripcion = descripcion;
            await departamento.save();

            if(categorias){           
                
                const catDepar = await Departamento_Categoria.findAll({
                    where: {
                        idDepartamento: id
                    }
                })
                
                for (const categoria of catDepar) {
                    
                    const exits = categorias.find((x : Categoria) => x.id === categoria.idCategoria);

                    if(exits === undefined){
                        categoria.estatus = '0';
                        await categoria.save();
                    }
                }

                for(const categoria of categorias){
                    const exits = catDepar.find((x : Departamento_Categoria) => x.idCategoria === categoria.id);
                    if(exits === undefined){
                        await Departamento_Categoria.create({
                            idDepartamento: departamento.id,
                            idCategoria: categoria.id,                        
                            ip: req.ip
                        });
                    }
                }                    
            }

            return res.status(200).json({
                status: true,
                departamento
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

const deleteDepartamento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const departamento = await Departamento.findByPk(id);

        if (departamento) {
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

const deleteDepartamentoEmpleadoAsignacion = async (req: Request, res: Response) => {
    try {        
        const { id } = req.params;
        const departamentoEmpleado = await Departamento_Empleado.findByPk(id);

        if (departamentoEmpleado) {
            departamentoEmpleado.estatus = '0';
            await departamentoEmpleado.save();            
        }

        return res.status(200).json({
            status: true,            
        });

    } catch (error) {
        res.status(500).json({
            status: false
        });
    }
}

const patchEnableDepartamento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const departamento = await Departamento.findByPk(id);

        if (departamento) {
            departamento.estatus = '1';
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


export { getDepartamento, postDepartamento, getDepartamentoById, putDepartamento, deleteDepartamento, getDepartamentoCategorias, getDepartamentoEmpleados, patchEnableDepartamento, deleteDepartamentoEmpleadoAsignacion };