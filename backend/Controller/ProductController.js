const Product = require("../Model/ProductModel");
const { redisClient } = require('../Config/redis');
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create product",
        });
    }
};
const getAllProducts = async (req, res) => {
    try {
        const cachedProducts = await redisClient.get("products");

        if (cachedProducts) {
            console.log("Products fetched from Redis cache");
            return res.status(200).json({
                success: true,
                message: "Products fetched successfully",
                products: JSON.parse(cachedProducts),
                source: "redis Cache",
            });
        }
        const products = await Product.find();
        await redisClient.setEx("products", 60 * 5, JSON.stringify(products));
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id); // params = parameter in the URL
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch product by ID",
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update product",
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete product",
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};