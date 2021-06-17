import { body, ValidationChain } from 'express-validator';
import { Persona } from '../models/Persona';
import { Usuario } from '../models/Usuario';

abstract class RequestValidation {
    abstract validation: ValidationChain[]
}

class PersonaValidation extends RequestValidation {

    validation = [

        body('nombre')
            .trim()
            .notEmpty()
            .withMessage("Nombre Requerido"),
        body('primerAp')
            .trim()
            .notEmpty()
            .withMessage("Primer Apellido Requerido"),
        body('telefono')
            .isLength({
                max: 10, min: 10
            })
    ];
}

class DepartamentoValidation extends RequestValidation {
    validation = [
        body('nombre')
            .notEmpty().withMessage("Campo Requerido")
    ]
}

class UsuarioValidation extends RequestValidation {
    validation = [
        body("password")
            .trim()
            .isLength({
                min: 8,
                max: 16
            })
            .withMessage("Contraseña Requerida"),
        body('email')
            .isEmail()
            .withMessage("El Correo Electrónico debe de ser válido")
            .custom(async value => {
                try {

                    const emailInUse = await Usuario.findOne({
                        where: {
                            email: value
                        }
                    });

                    if (emailInUse !== null) {
                        return Promise.reject("El Correo Electrónico ya está en Uso");
                    }
                } catch (error) {
                    console.log(error)
                    return Promise.reject("Error del Servidor");
                }
            }),
    ]
}

class CapituloValidation extends RequestValidation {
    validation = [
        body("nombre")
            .notEmpty()
            .withMessage("Nombre requerido"),
        body("tipo")
            .notEmpty()
            .withMessage("Tipo del recurso requerido"),
        body("file.base64")
            .notEmpty()
            .withMessage("file.base64 requerido"),
        body("file.fileName")
            .notEmpty()
            .withMessage("file.fileName requerido"),
        body("file.ext")
            .notEmpty()
            .withMessage("file.ext requerido"),
        body('idCategoria')
            .notEmpty()
            .isNumeric()
            .withMessage('idCategoria requerido')
    ]
}

export { PersonaValidation, DepartamentoValidation, UsuarioValidation, CapituloValidation };