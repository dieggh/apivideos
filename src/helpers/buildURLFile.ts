import { Capitulo } from "../models/Capitulo";
import jwt from 'jsonwebtoken';
import { config } from "../config/config";
import { Capitulo_Empleado_Categoria } from "../controllers/EmpleadoController";

const buildURL = (capitulos: Capitulo[] | Capitulo_Empleado_Categoria[], id: number, nivelAcceso: number ) =>{
    const token = jwt.sign({
        idKind: id, nivelAcceso
    }, config.KEY_FILES, {
        expiresIn: '7h'
    });
    for (const cap of capitulos) {
         cap.path = `${process.env.SERVE_FILES!}/files/${token}/${cap.id}/${cap.path.replace('dist/public/', '')}`;        
    }
}

export {
    buildURL
}