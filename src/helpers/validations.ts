import { body, ValidationChain } from 'express-validator';
import { Persona } from '../models/Persona';
import { Usuario } from '../models/Usuario';

abstract class RequestValidation {
    abstract validation: ValidationChain[]
}

class PersonaValidation extends RequestValidation {

    validation = [

        body('persona.nombre')
            .trim()
            .notEmpty()
            .withMessage("Nombre Requerido"),
        body('persona.primerAp')
            .trim()
            .notEmpty()
            .withMessage("Primer Apellido Requerido"),
        body('persona.telefono')
            .isLength({
                max: 15, min: 10
            })
            .withMessage("Teléfono Inválido")
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
        body("usuario.password")
            .trim()
            .isLength({
                min: 6,
                max: 16
            })
            .withMessage("Contraseña Requerida"),
        body('usuario.email')
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
        body('idCategoria')
            .notEmpty()
            .isNumeric()
            .withMessage('idCategoria requerido')
    ]
}

export { PersonaValidation, DepartamentoValidation, UsuarioValidation, CapituloValidation };