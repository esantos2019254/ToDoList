export const tieneRole = (...roles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(500).json({
        success: false,
        msg: 'Debe validar el token antes de verificar el rol'
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        msg: `Acceso denegado. Rol actual: '${user.role}'. Se requiere uno de: [${roles.join(', ')}]`
      });
    }

    next();
  };
};
