import { response, request } from "express";
import Category from './category.model.js';
import Book from '../books/book.model.js';

export const categoryPost = async (req, res) => {
    const {categoryName, description} = req.body;
    const category = new Category({categoryName, description});

    await category.save();

    res.status(200).json({
        category
    });
}

export const categoriesGet = async (req = request, res = response) => {
    const query = {state: true};

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
    ]);
    res.status(200).json({
        total,
        categories
    });    
}

export const categoryPut = async (req, res = response) => {
    const{id} = req.params;
    const {categoryName, ...resto } = req.body;

    const cateDefault = await Category.findOne({categoryName: 'Books'});
    if(id === cateDefault._id.toString()){
        return res.status(401).json({ msg: 'Category default cannot be edited.' });
    }

    const category = await Category.findByIdAndUpdate(id, resto);

    res.status(200).json({
        msg: 'Category actualized',
        category
    });
}


export const categoryDelete = async (req, res) => {
    const{id} = req.params; 
    const cateDefault = await Category.findOne({categoryName: 'Books'});

    if(id === cateDefault._id.toString()){
        return res.status(400).json({ msg: 'Category default cannot be deleted.' });
    }

    const category = await Category.findByIdAndUpdate(id, {state: false});

    if(!category){
        return res.status(404).json({ msg: 'Category not found' });
    }

    await Book.updateMany({ category: id }, { category: cateDefault._id });

    res.status(200).json({
        msg: 'Category eliminated',
        category
    });
}