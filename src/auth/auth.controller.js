import Usuario from '../users/user.model.js';
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
  const { email, password, username } = req.body;

  try {

    const user = await Usuario.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: 'Credenciales incorrectas'
      });
    }

    if (!user.estado) {
      return res.status(400).json({
        msg: 'Este usuario no existe'
      });
    }

    const validPassword = await verify(user.password, password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Credenciales incorrectas'
      });
    }

    const token = await generarJWT(user.id);

    return res.status(200).json({
      msg: 'Inicio de sesión exitoso',
      userDetails: {
        username: user.username,
        token,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'Error del servidor',
      error: error.message
    });
  }
};

export const register = async (req, res) => {
  try {
    const { name, surname, username, email, phone, password, role } = req.body;

    const profilePicture = req.file?.filename || null;

    const encryptedPassword = await hash(password);

    const user = await Usuario.create({ name, surname, username, email, phone, password: encryptedPassword, role, profilePicture });

    return res.status(201).json({
      msg: 'Usuario registrado con éxito',
      userDetails: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'Fallo al registrar el usuario',
      error: error.message
    });
  }
};