import jwt from "jsonwebtoken";

// doctor authentication middleaware

const authDoctor = async (request, response, next) => {
  const { dToken } = request.headers;
  if (!dToken) {
    return response.json({
      success: false,
      message: "Not Authorized Login Again",
    });
  }

  try {
    const token_decode = jwt.verify(dToken, process.env.JWT_SECRET);
    request.body.docId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    return response.json({ success: false, message: error.message });
  }
};

export default authDoctor;
