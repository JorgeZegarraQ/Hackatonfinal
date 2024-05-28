const Product = require('../models/product.model');

exports.getAllProducts = async (req, res) => {
    try {       

        const products = await Product.find({})
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

exports.filterProducts = async (req, res) => {
    try {

        let query = {};

        if (req.body.category) {
            query.category = req.body.category;
        }

        if (req.body.priceRange) {
            const [min, max] = req.body.priceRange.split('-').map(Number);
            query.price = { $gte: min, $lte: max };
        }

        if (req.body.search) {
            query.name = { $regex: req.body.search, $options: 'i' };
        }
        const products = await Product.find(query);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            upc: req.body.upc
        });
        const savedProduct = await newProduct.save();

        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {                    
        const counter = await Product.deleteOne(
            { upc: req.body.upc }
          );
        res.status(200).json("Deleted");     
    }
    catch (err) {
        res.status(500).send({
            message: "Could not delete Product with upc=" + req.body.upc
        });
    };
};

exports.updateProduct = async (req, res, next) => {
    try {         
        var updatefields = {}
        if(req.body.name){
            updatefields.name = req.body.name
        }      
        if(req.body.description){
            updatefields.description = req.body.description
        }    
        if(req.body.price){
            updatefields.price = req.body.price
        }    
        if(req.body.category){
            updatefields.category = req.body.category
        }         
        const counter = await Product.updateOne(
            { upc: req.body.upc },
            updatefields
          );
        res.status(200).json("Updated");     
    }
    catch (err) {
        res.status(500).send({
            message: "Could not update Product with upc=" + req.body.upc
        });
    };
};


