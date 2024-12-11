import jwt from "jsonwebtoken";

// Doctor authentication middleware
const authDoctor = async (request, response, next) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response
        .status(401)
        .json({ success: false, message: "Not Authorized. Login again." });
    }

    const dToken = authHeader.split(" ")[1];
    console.log(dToken);

    // Verifying the token
    const token_decode = jwt.verify(dToken, process.env.JWT_SECRET);

    // Assign docId to request body for further use in the controller
    request.body.docId = token_decode.id;

    next();
  } catch (error) {
    console.log(error);
    return response
      .status(401)
      .json({ success: false, message: "Unauthorized" });
  }
};

export default authDoctor;
