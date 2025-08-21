const { protectRoute } = require('../middleware/auth.middleware')
const messageController = require('../controllers/message.controller')

const router = require('express').Router() 

router.get('/users' , protectRoute , messageController.getUsersForSidebar )
router.get('/:id' , protectRoute , messageController.getMessages )
router.post('/send/:id',protectRoute,messageController.sendMessage)

module.exports = router