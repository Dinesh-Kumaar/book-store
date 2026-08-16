const express = require("express");
const router = express.Router();
const adminAuth = require("../Middleware/adminMiddleware");
const userAuth = require("../Middleware/authMiddleware");
const {createProduct, getAllProducts, getProductById, updateProduct, deleteProduct} = require('../Controller/ProductController');

router.post('/create',userAuth, adminAuth, createProduct);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id",userAuth, adminAuth, updateProduct);
router.delete("/products/:id",userAuth, adminAuth, deleteProduct);


module.exports = router;