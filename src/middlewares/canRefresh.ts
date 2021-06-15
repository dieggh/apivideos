import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserInfo } from 'os';
import { config } from '../config/config';
import { Administrador } from '../models/Administrador';
import { Empleado } from '../models/Empleado';
import { Usuario } from '../models/Usuario';

interface UserPayload {
    id: number;
    nivelAcceso: number,
    email: string;
    typeUser: string;
    idKind: number;
}
interface UserRefresh {
    id: number;
    nivelAcceso: number;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

module.exports = async (req: Request, res: Response, next: NextFunction) => {

    
}
