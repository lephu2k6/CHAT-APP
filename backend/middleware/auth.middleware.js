const jwt = require('jsonwebtoken');
const Usermodel = require('../models/user.model')

const protectRoute = async (req, res , next) => {
    try {
        const token = req.cookies.jwt 
        if(!token) {
            return res.status(404).json({
                message: "bạn chưa đăng nhập"
            })
        }
        
        const decode = jwt.verify(token ,process.env.JWT_SECRET )
        const user =await Usermodel.findById(decode.userId).select("-password")
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
        req.user = user
        next()
        
    } catch(err) {
        console.log(err) 
        res.status(500).json({
            message: "Lỗi Server"
        })
    }
}
module.exports = {protectRoute}