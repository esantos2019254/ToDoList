import { hash, verify } from 'argon2';
import User from './user.model.js';

export const getUsers = async (req, res) => {
  try {
    const { limite = 10, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).skip(Number(desde)).limit(Number(limite))
    ]);

    res.status(200).json({ success: true, total, users });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.user
    const user = await User.findById(id);

    if (!user)
      return res.status(404).json({ success: false, msg: 'Usuario no encontrado' });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error al obtener usuario',
      error: error.message
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, surname, username, oldPassword, newPassword } = req.body;
    const profilePicture = req.file?.filename;

    console.log(profilePicture)

    console.log(req.body)

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, msg: 'Usuario no encontrado' });

    if (oldPassword && newPassword) {
      const password = await verify(user.password, oldPassword);
      if (!password) {
        return res.status(400).json({ success: false, msg: 'La contraseña actual es incorrecta' });
      }
      user.password = await hash(newPassword);
    }

    user.name = name || user.name;
    user.surname = surname || user.surname;
    user.username = username || user.username;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    const { password, ...userData } = user.toObject();
    res.status(200).json({
      success: true,
      msg: 'Usuario actualizado',
      user: userData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status(200).json({
      success: true,
      msg: 'Usuario desactivado',
      user,
      authenticatedUser: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error al desactivar usuario',
      error: error.message
    });
  }
};
