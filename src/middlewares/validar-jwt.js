import jwt from 'jsonwebtoken';
import User from '../users/user.model.js';

export const validarJWT = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ msg: 'No hay token en la petición' });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const user = await User.findById(uid);
    if (!user) {
      return res.status(401).json({ msg: 'Token no válido - usuario no existe' });
    }

    if (!user.estado) {
      return res.status(401).json({ msg: 'Token no válido - usuario desactivado' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error al validar JWT:', error.message);
    return res.status(401).json({ msg: 'Token no válido' });
  }
};
