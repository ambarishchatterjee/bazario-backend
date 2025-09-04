const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Place order
exports.placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const orderItems = cart.items.map((i) => ({
      product: i.product._id,
      vendor: i.product.vendor,
      quantity: i.quantity,
      price: i.product.price,
    }));

    const totalAmount = orderItems.reduce(
      (sum, i) => sum + i.quantity * i.price,
      0
    );

    const order = new Order({
      buyer: req.user._id,
      items: orderItems,
      totalAmount,
    });

    await order.save();
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get buyer orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).populate(
      "items.product"
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get vendor orders
exports.getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "items.vendor": req.user._id }).populate(
      "items.product"
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
