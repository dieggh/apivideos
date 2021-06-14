import { body, ValidationChain } from 'express-validator';
import { Persona } from '../models/Persona';
import { Usuario } from '../models/Usuario';

abstract class RequestValidation {
    abstract validation: ValidationChain[]    
}

class PersonaValidation extends RequestValidation{

    validation = [
    
        body('nombre')
            .trim()
            .notEmpty()
            .withMessage("Nombre Requerido"),
        body('primerAp')
            .trim()
            .notEmpty()
            .withMessage("Primer Apellido Requerido"),
        body('email')
            .isEmail()
            .withMessage("El Correo Electrónico debe de ser válido")
            .custom(async value =>{
                try {
                    
                    const emailInUse = await Usuario.findOne({
                        where:{
                            email: value
                        }
                    });
            
                    if( emailInUse !== null ){
                        return Promise.reject("El Correo Electrónico ya está en Uso");
                    }    
                } catch (error) {
                    return Promise.reject("Error del Servidor");
                }                
            }),
        body('telefono')
            .isLength({
                max: 10, min: 10
            })
    ];
}

class EmpleadoValidation extends RequestValidation {
    validation = [
        body('idRol')
            .notEmpty().withMessage("Campo Requerido")
            .isInt().withMessage("El Valor debe de ser entero"),
        body('idPersona')
            .notEmpty().withMessage("Campo Requerido")
            .isInt().withMessage("El Valor debe de ser entero"), 
        body('idDependencia')
            .notEmpty().withMessage("Campo Requerido")
            .isInt().withMessage("El Valor debe de ser entero"), 
        body('usuario')
            .trim()
            .notEmpty()
            .isLength({
                min: 4
            }).withMessage("La longitud del usuario debe de ser al menos de 4 carácteres"),
        body('contraseña')
            .trim()
            .isLength({
                min: 6
            }).withMessage("La longitud de la contraseña debe de ser al menos 6 carácteres")
            .notEmpty().withMessage("Contraseña Requerida")
    ];

    validate = () =>{
        
    }
}


export { PersonaValidation, EmpleadoValidation };