
import Task from "./task.model.js";

export const getTasks = async (req, res) => {
  try {
    const query = { estado: true };

    const [total, tasks] = await Promise.all([
      Task.countDocuments(query),
      Task.find(query)
    ]);

    res.status(200).json({ success: true, total, tasks });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error al obtener usuarios',
      error: error.message
    });
  }
}

export const addTask = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const img = req.file?.filename || null;
    const user = req.user._id;

    const task = await Task.create({ title, description, date, user, img });

    return res.status(201).json({
      msg: 'Usuario registrado con éxito',
      task
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'Fallo al agregar tarea',
      error: error.message
    });
  }
};

export const getTasksByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await Task.find({ user: userId, estado: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: 'Error al obtener las tareas',
      error: error.message
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, date, status } = req.body;
    const userId = req.user._id;

    const task = await Task.findOne({ _id: taskId, user: userId, estado: true });

    if (!task) {
      return res.status(404).json({
        success: false,
        msg: "Tarea no encontrada o no autorizada",
      });
    }

    const img = req.file?.filename || task.img;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.date = date ?? task.date;
    task.status = status ?? task.status;
    task.img = img;

    await task.save();

    res.status(200).json({
      success: true,
      msg: "Tarea actualizada con éxito",
      task,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Error al actualizar tarea",
      error: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;

    const task = await Task.findOne({ _id: taskId, user: userId, estado: true });

    if (!task) {
      return res.status(404).json({
        success: false,
        msg: "Tarea no encontrada o no autorizada",
      });
    }

    task.estado = false;
    await task.save();

    res.status(200).json({
      success: true,
      msg: "Tarea eliminada con éxito",
      task,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Error al eliminar tarea",
      error: error.message,
    });
  }
};