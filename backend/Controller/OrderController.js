const Order = require('../Model/OrderModel');
const Product = require('../Model/ProductModel');
const User = require('../Model/UserModel');

const addToOrder = async (req, res) => {
  try {
    // 1. Destructure 'items' (the array) and user details from req.body
    const { items, user, userName, mode } = req.body;

    let totalOrderPrice = 0;
    const processedItems = [];

    // 2. Loop through each item in the array to verify it and calculate prices
    for (const item of items) {
      const foundProduct = await Product.findById(item.product);
      if (!foundProduct) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product} not found`
        });
      }

      const individualPrice = foundProduct.price;
      const itemTotalPrice = individualPrice * item.quantity;
      totalOrderPrice += itemTotalPrice;

      // Push the processed item with its calculated prices into our array
      processedItems.push({
        product: item.product,
        quantity: item.quantity,
        individualPrice: individualPrice,
        totalPrice: itemTotalPrice
      });
    }

    // 3. Create the new order with the processed items array
    const newOrder = new Order({
      items: processedItems, // Saves the entire array
      totalOrderPrice,       // The grand total for the whole order
      user,
      userName,
      mode
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, data: savedOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("products.product");
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product') // Adjust fields based on your productSchema
      .populate('user'); // Adjust fields based on your userSchema

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const updateOrder = async (req, res) => {
  try {
    const { quantity, userName, mode } = req.body;
    let updateData = { userName, mode };

    // If quantity changes, recalculate the price dynamically
    if (quantity) {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      updateData.quantity = quantity;
      updateData.totalPrice = order.individualPrice * quantity;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { addToOrder, getOrder, getAllOrders, updateOrderStatus, updateOrder, deleteOrder };