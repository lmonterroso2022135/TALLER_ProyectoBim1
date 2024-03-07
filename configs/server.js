'use strict'

import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import express from 'express'
import { dbConnection } from './mongo.js'
import userRoutes from '../src/users/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';

import User from '../src/users/user.model.js'

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.authPath = '/onlineShop/v1/auth';
        this.userPath = '/onlineShop/v1/users';
        this.middlewares();
        this.connectDB();
        this.routes();
    }
    async connectDB(){
        await dbConnection();
        const existingUser = await User.findOne({ email: 'admindefault@gmail.com' });
        if(!existingUser){
            User.create({
                name: 'Admin',
                email: 'admindefault@gmail.com',
                password: '123456',
                role: 'ADMIN'
            })
            console.log('-> Default user is created.');    
        }
    }
    middlewares(){
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }
    routes(){
        this.app.use(this.userPath, userRoutes);
        this.app.use(this.authPath, authRoutes);   
    }
    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;