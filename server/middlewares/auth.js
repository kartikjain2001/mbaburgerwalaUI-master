//This middleware is used to allow the /me section only to the people who are logged in.
import ErrorHandler from "../utils/ErrorHandler.js";
export const isAuthenticate = (req, res, next) => {
  const token = req.cookies["connect.sid"]; //cookie is different for every individual. So, we will use it to check if the person is logged in or now.

  if (!token) {
    return next(new ErrorHandler("Not Logged In", 401));
  }
  next();
};

export const authorizeAdmin = (req, res, next) => {
  const token = req.cookies["connect.sid"]; //cookie is different for every individual. So, we will use it to check if the person is logged in or now.

  if (req.user.role !== "admin") {
    return next(new ErrorHandler("Only Admin Allowed", 405));
  }
  next();
};
