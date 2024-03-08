import { response, request } from "express";
import Product from "./product.model.js";
import Category from "../categories/category.model.js"

/////////////////////////////////////////////////////////////////////////
export const productPost = async (req, res) => {
    const {productName, description, stock, category} = req.body;
    const cate = await Category.findOne({categoryName: category});

    if(!cate){
        return res.status(404).json({ msg: 'Category doesnt exits in the database' });
    };
    if(!cate.state){
        return res.status(404).json({ msg: 'Category was removed.' });
    };

    const product = new Product({productName, description, stock, category: cate._id});
    await product.save();

    res.status(200).json({
        product
    });
}

export const productsGet = async (req =request, res = response) => {
    const query = {state: true};
    
    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
        .populate('category', ['categoryName', 'description'])
    ]);

    res.status(200).json({
        msg: 'Products available.',
        total,
        products
    })
}

export const productDelete = async (req, res) => {
    const {productName} = req.body;

    // Validaciones de producto
    const prod = await Product.findOne({productName: productName});
    if(!prod){
        return res.status(404).json({ msg: 'Product doesnt exits in the database' });
    };
    if(!prod.state){
        return res.status(404).json({ msg: 'Product was removed.' });
    };    

    const product = await Product.findByIdAndUpdate(prod._id, {state: false});

    res.status(200).json({
        msg: 'Product has been removed.',
        product
    });
};

export const productPut = async (req, res = response) => {
    const {productName} = req.body;
    const {_id, category, ...resto} = req.body;

    // Validaciones de producto
    const prod = await Product.findOne({productName: productName});
    if(!prod){
        return res.status(404).json({ msg: 'Product doesnt exits in the database' });
    };
    if(!prod.state){
        return res.status(404).json({ msg: 'Product was removed.' });
    };

    // validaciones de categoria
    const cate = await Category.findOne({categoryName: category});
    if(!cate){
        return res.status(404).json({ msg: 'Category doesnt exits in the database' });
    };
    if(!cate.state){
        return res.status(404).json({ msg: 'Category was removed.' });
    };

    const product = await Product.findByIdAndUpdate(prod._id, {...resto, category: cate._id});

    res.status(200).json({
        msg: 'Product actualized',
        product
    });
}
/////////////////////////////////////////////////////////////////////////



