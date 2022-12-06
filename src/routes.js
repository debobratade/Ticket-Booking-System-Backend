const express = require('express')
const router = express.Router()
const { authentication} = require('./middleware/authentication')
const { registerUser, userLogin} = require('./controller/userController')
const {addEvent, getEventtByUserId, deleteDocById, getAllEventtByUserId, updateEventstatus, getAllEventt }= require('./controller/eventController')
const { addTicket, getTicketById, deletetick} = require('./controller/ticketController')


router.post('/register',   registerUser)   
router.post('/login', userLogin)

router.post('/add', authentication, addEvent)
router.get('/getbyid/:Id', authentication, getEventtByUserId)
router.get('/getall',  getAllEventt)
router.get('/getallbyid/:Id', authentication, getAllEventtByUserId)
router.delete('/deletedoc/:Id', authentication, deleteDocById)
router.put('/changestatus/:Id',authentication, updateEventstatus)

router.post('/addticket/:Id', addTicket)
router.get('/getticket/:Id', getTicketById)
router.delete('/deltick/:Id', deletetick)

module.exports = router 