import express from "express";
import {
  getAdminOrders,
  getMyOrders,
  getOrderDetails,
  placeOrder,
  processOrder
} from "../controllers/order.js";
import { authorizeAdmin, isAuthenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/createorder", isAuthenticate, placeOrder);

router.get("/myorders", isAuthenticate, getMyOrders);

router.get("/order/:id", isAuthenticate, getOrderDetails);

//Add admin middleware

router.get("/admin/orders", isAuthenticate, getAdminOrders);

router.get("/admin/orders", isAuthenticate, authorizeAdmin, getAdminOrders);

router.get("/admin/orders/:id", isAuthenticate, authorizeAdmin, processOrder);

export default router;
