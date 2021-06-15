import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

interface UserPayload {
    id: number;
    nivelAcceso: number,
    email: string;
    typeUser: string;
    idKind: number;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

const isAuthAdmin = (req: Request, res: Response, next: NextFunction) => {

    try {
        const payload = isAuth(req, res) as UserPayload;
        if (payload.nivelAcceso === 0) {
            req.currentUser = payload;
            next();
        }else{
            res.status(401).json({
                message: "Permisos Insuficientes",
                status: false
            })
        }
    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: "Token no Proveído",
            status: false
        })
    }

}

const isAuthUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = isAuth(req, res) as UserPayload;
       
        req.currentUser = payload;
        next();
    
    } catch (error) {
        res.status(401).json({
            message: "Token no Proveído",
            status: false
        })
    }
}
const isAuth = (req: Request, res: Response,) => {
    try {
        const token = req.headers.authorization?.toString();
        console.log(token)
        if (token) {

            const payload = jwt.verify(token.replace('bearer ', ''), config.KEY_SECRET) as UserPayload;
            return payload;

        } else {
            throw "Token no Proveído";
        }
    } catch (error) {
        throw error;
    }
}

export {
    isAuthAdmin,
    isAuthUser
};