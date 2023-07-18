import express from "express";
import passport from "passport";
import { getAdminUsers, logout, myProfile } from "../controllers/user.js";
import { authorizeAdmin, isAuthenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get(
  "/googlelogin",
  passport.authenticate("google", {
    scope: ["profile"]
  })
);
router.get(
  "/login",
  passport.authenticate("google", {
    scope: ["profile"],
    successRedirect: process.env.FRONTEND_URL
  })
);

router.get("/me", isAuthenticate, myProfile);

router.get("/logout", logout);

//admin route

router.get("/admin/users", isAuthenticate, authorizeAdmin, getAdminUsers);

export default router;
