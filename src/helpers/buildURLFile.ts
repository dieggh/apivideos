import { Capitulo } from "../models/Capitulo";
import jwt from 'jsonwebtoken';
import { config } from "../config/config";

const buildURL = (capitulos: Capitulo[], id: number, nivelAcceso: number ) =>{
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