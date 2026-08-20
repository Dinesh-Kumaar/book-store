const express = require('express');
const router = express.Router();

const adminAuth = require("../Middleware/adminMiddleware");
const userAuth = require("../Middleware/authMiddleware");

const {addToOrder, getOrder, getAllOrders,updateOrderStatus, updateOrder, deleteOrder} = require('../Controller/OrderController')
router.post('/create-order', userAuth,  addToOrder);
router.get('/get-order/', userAuth,  getOrder);
router.get('/get-all-orders', adminAuth, getAllOrders);
router.put('update-order-status/:id', adminAuth, updateOrderStatus);
router.put('/update-order/:id', userAuth,  updateOrder);
router.delete('/delete-order/:id', userAuth, deleteOrder);

module.exports = router;