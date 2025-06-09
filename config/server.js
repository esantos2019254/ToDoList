import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from '../config/mongo.js';
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/users/user.routes.js'
import taskRoutes from '../src/task/task.routes.js'

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors({
        origin: ['https://todolist-4d8ec.web.app', 'https://todolist-4d8ec.firebaseapp.com'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }));
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
}

const routes = (app) => {
    app.use('/uploads/profile-pictures', cors({
        origin: ['https://todolist-4d8ec.web.app', 'https://todolist-4d8ec.firebaseapp.com'],
        credentials: true
    }), express.static(path.join(__dirname, '../src/public/uploads/profile-pictures')));
    app.use("/toDoList/v1/auth", authRoutes);
    app.use("/toDoList/v1/users", userRoutes);
    app.use("/toDoList/v1/tasks", taskRoutes);
}

const connectDB = () => {
    try {
        dbConnection();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(`MongoDB connection failed: ${error}`);
        process.exit(1);
    }
}

export const initServer = () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app)
        routes(app)
        connectDB()
        app.listen(port)
        console.log(`Server is running on port ${port}`);
    } catch (error) {
        console.error(`Init server failed ${error}`);
    }
}