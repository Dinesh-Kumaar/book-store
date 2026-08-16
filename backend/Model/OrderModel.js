const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      productName: {type: String, required: true},
      quantity: { type: Number, required: true, min: 1 },
      individualPrice: { type: Number, required: true },
      totalPrice: { type: Number, required: true }
    }
  ],
  totalOrderPrice: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  mode: { type: String, required: true },
  status: {type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending"},
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
