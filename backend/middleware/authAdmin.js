import jwt from "jsonwebtoken"

const authAdmin = async (request, response, next) => {
    try {
        const {token} = request.headers;
        if(!token) {
            response.json({success: false, message: "Not Authorized Login in again"});
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        if(!token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            response.json({success: false, message: "Invalid token"});
        }
        next();
    } catch(error) {
        console.log(error)
        response.json({success: false, message: "UnAuthorized"})
    }
}

export default authAdmin;