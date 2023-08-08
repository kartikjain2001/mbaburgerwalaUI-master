import { asyncError } from "../middlewares/errorMiddleware.js";
import { Order } from "../models/Order.js";
import { Payment } from "../models/payment.js";

import ErrorHandler from "../utils/ErrorHandler.js";
import { instance } from "../server.js";
import crypto from "crypto";

export const placeOrder = asyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount
  } = req.body;

  const user = req.user._id;

  const orderOptions = {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    user
  };

  await Order.create(orderOptions);

  res.status(201).json({
    success: true,
    message: "Order Placed Successfully via Cash On Delivery"
  });
});

export const placeOrderOnlline = asyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount
  } = req.body;

  const user = req.user._id;

  const orderOptions = {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    user
  };

  const options = {
    amount: Number(totalAmount) * 100, // amount in the smallest currency unit
    currency: "INR"
  };
  const order = await instance.orders.create(options);

  await Order.create(orderOptions);

  res.status(201).json({
    success: true,
    order,
    orderOptions
  });
});

export const paymentVerification = asyncError(async (req, res, next) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    orderOptions
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    const payment = await payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    await Order.create({
      ...orderOptions,
      paidAit: new Date(date.now()),
      paymentInfo: paymend._id
    });
    res.status(201).json({
      success: true,
      message: `Order Placed successfully. Payment Id: ${payment._id}`
    });
  } else {
    return next(new ErrorHandler("Payment Failed", 400));
  }
});

export const getMyOrders = asyncError(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id
  }).populate("user", "name");
  res.status(200).json({
    success: true,
    orders
  });
});

export const getOrderDetails = asyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name");

  if (!order) return next(new ErrorHandler("Invalid Order Id", 404));
  res.status(200).json({
    success: true,
    order
  });
});
export const getAdminOrders = asyncError(async (req, res, next) => {
  const orders = await Order.find({})({
    user: req.user._id
  }).populate("user", "name");
  res.status(200).json({
    success: true,
    orders
  });
});

export const processOrder = asyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name");

  if (!order) return next(new ErrorHandler("Invalid Order Id", 404));

  if (order.orderStatus === "Preparing") order.orderStatus = "Shipped";
  else if (order.orderStatus === "Shipped") {
    order.orderStatus = "Delievered";
    order.delieveredAt = new Date(Date.now());
  } else if (order.orderStatus === "Delievered")
    return next(new ErrorHandler("food already delievered", 400));

  await order.save();

  res.status(200).json({
    success: true,
    message: "Status Updated Successfully"
  });
});
