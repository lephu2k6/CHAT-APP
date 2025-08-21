const { generateToken } = require('../config/utils');
const Usermodel = require('../models/user.model')
const bcrypt = require('bcrypt');
const cloudinary = require('../config/cloudinary')

const signup = async (req , res ) => {
    try {
        const {email , fullName , password} = req.body 
        if (!email || !fullName || !password) {
            return res.status(404).json({message : 'Vui lòng nhập đầy đủ'})
        }
        if (password.length < 6) {
            return res.status(400).json({message: 'Vui lòng nhập mk lớn hơn 6 ký tự'})
        }
        const user = await Usermodel.findOne({email})
        if (user) {
            return res.status(400).json({message: 'email đã tồn tại'})
        }
        const salt = 10 ;
        const hashedPassword = await bcrypt.hash(password , salt)  
        const newUser = await Usermodel.create(
            {
                email ,
                fullName , 
                password : hashedPassword
            }
        )
        return res.status(201).json({message: 'Đăng ký thành công', user: newUser});
    }catch(err) {
        console.log(err)
        res.status(500).json({message: 'Lỗi Server'})
    }
}
const login = async  (req ,res) => {
    try {
        const {email, password} = req.body 
    if(!email || !password) {
        return res.status(404).json({
            message: 'Vui lòng nhập đầy đủ thông tin'
        })
    }
    const user = await Usermodel.findOne({email})
    if (!user) {
        return res.status(404).json({
            message: 'email đéo tồn tại nha em zai hẹ hẹ'
        })
    }
    const IsPassword = await bcrypt.compare(password,user.password )
    if (!IsPassword) {
        return res.json({
            messsge: 'Sai mật khẩu nha cu '
        })
    }
    generateToken(user._id , res )
    res.status(200).json({
        _id : user._id , 
        fullname : user.fullName , 
        email:user.email , 
        profilePic : user.profilePic,
        token: generateToken(user._id , res )
    })
    }catch(err) {
        res.status(500).json({
            message: "Lỗi server"
        })
    }

}
const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0) // Hết hạn ngay lập tức
        });
        res.status(200).json({ message: 'Đăng xuất thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi đăng xuất' });
    }
}
const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body 
        const userId = req.user._id
        if(!profilePic){
            return res.status(400).json({message: 'bắt buộc phải có'})
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updateUser = await Usermodel.findByIdAndUpdate(userId , {profilePic:uploadResponse.secure_url} , {new : true})
        res.status(200).json(updateUser)
    }catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Lỗi Server'
        })
    }
}
const checkAuth = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Chưa xác thực hoặc token không hợp lệ' });
        }
        res.status(200).json(req.user);
        
    } catch (err) {
        console.log(err.user);
        res.status(500).json({ message: 'Lỗi server' });
    }
}
module.exports = { signup,login,logout,updateProfile,checkAuth }