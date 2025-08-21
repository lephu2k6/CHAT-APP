const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Chat-app');
        console.log('Kết nối thành công !!!')
    }catch (err) {
        console.log('không thể kết nối db')
    }
}
module.exports = connectDB