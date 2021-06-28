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
            res.status(403).json({
                message: "Permisos Insuficientes",
                status: false
            });
        }
    } catch (error) {        
        res.status(401).json({
            message: error.message,
            status: false
        })
    }

}

const isAuthUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = isAuth(req, res) as UserPayload;
        
        if (payload.nivelAcceso < 2) {
            req.currentUser = payload;
            next();
        }else{
            return res.status(403).json({
                message: "Permisos Insuficientes",
                status: false
            });
        }
    
    } catch (error) {
        res.status(401).json({
            message: error.message,
            status: false
        })
    }
}

const isAuthEmployer = (req: Request, res: Response, next: NextFunction) =>{
    try {
        const payload = isAuth(req, res) as UserPayload;
        
        if(payload.nivelAcceso === 2){
            req.currentUser = payload;
            next();
        }else{
            res.status(403).json({
                message: "Permisos Insuficientes",
                status: false
            });
        }
        
    
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
        if (token) {

            const payload = jwt.verify(token.replace('Bearer ', ''), config.KEY_SECRET) as UserPayload;
            return payload;

        } else {
            throw new Error("Token no Proveído");
        }
    } catch (error) {        
        throw error;
    }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = isAuth(req, res) as UserPayload;
        if(payload){
            req.currentUser = payload;
            next();
        }                                        
    } catch (error) {
        res.status(401).json({
            message: error,
            status: false
        })
    }
}
export {
    isAuthAdmin,
    isAuthUser,
    isAuthEmployer,
    verifyToken
};