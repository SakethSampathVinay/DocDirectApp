import jwt from "jsonwebtoken";

const authAdmin = async (request, response, next) => {
  try {
    const { token } = request.headers;
    if (!token) {
      return response
        .status(401)
        .json({ success: false, message: "Not Authorized Login in again" });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    if (
      !token_decode !==
      process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD
    ) {
      return response
        .status(401)
        .json({ success: false, message: "Invalid token" });
    }
    next();
  } catch (error) {
    console.log(error);
    return response
      .status(401)
      .json({ success: false, message: "UnAuthorized" });
  }
};

export default authAdmin;
