'use strict'

import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import express from 'express'
import { dbConnection } from './mongo.js'
import userRoutes from '../src/users/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import categoryRoutes from '../src/categories/category.routes.js'
import productRoutes from '../src/products/product.routes.js'
//
//
import User from '../src/users/user.model.js'
import Category from '../src/categories/category.model.js'

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.authPath = '/onlineShop/v1/auth';
        this.userPath = '/onlineShop/v1/users';
        this.categoryPath = '/onlineShop/v1/categories';
        this.productPath = '/onlineShop/v1/products';
        //
        //
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
                address: 'undefined',
                phone: '00000000',
                email: 'admindefault@gmail.com',
                password: '123456',
                role: 'ADMIN'
            })
            console.log('-> Default user is created.');    
        }
        const existingCategory = await Category.findOne({ categoryName: 'Products' });
        if(!existingCategory){
            Category.create({
                categoryName: 'Products',
                description: 'This product doesnt have a category yet'
            })
            console.log('-> Default category is created.');    
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
        this.app.use(this.categoryPath, categoryRoutes);
        this.app.use(this.productPath, productRoutes);
        //
        //
    }
    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;