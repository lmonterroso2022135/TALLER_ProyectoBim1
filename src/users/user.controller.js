import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from './user.model.js';

// Obtener todos los usuarios
export const usersGet = async (req = request, res = response) => {
    const query = { state: true };

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
    ]);

    res.status(200).json({
        total,
        users
    });
}

// Agregar un usuario
export const userPost = async (req, res) => {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    await user.save();

    res.status(200).json({
        user
    });
}
// Registrar usuario default
export const register = async (req, res) => {
    const { name, email, password} = req.body;
    const user = new User({ name, email, password, role: 'CLIENT'});

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    await user.save();

    res.status(200).json({
        user
    });
}



// Editar usuario
export const userPut = async (req, res = response) => {
    const {id} = req.user;
    const { _id, password, email, ...resto } = req.body;

    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, resto);

    res.status(200).json({
        msg: 'Profile actualized',
        user
    });
}

// Eliminar perfil
export const userDelete = async (req, res) => {
    const {id} = req.user;
    const user = await User.findByIdAndUpdate(id, {state: false});
    const userAut = req.user;

    res.status(200).json({
        msg: 'Profile desactivated',
        user,
        userAut
    });
}
