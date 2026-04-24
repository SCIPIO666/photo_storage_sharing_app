const {Router}=require('express')
const usersRouter=Router()
const userController=require("../controllers/usersController")
const {protect}=require('../middleware/authMidleware')
const {userValidationRules,validate}=require('../validators/usersValidator')

usersRouter.post('/',
    userValidationRules, // Set the rules
    validate,            // check user details aganiast the rules
    userController.createUser)
usersRouter.get('/',userController.listUsers)
usersRouter.get('/:userId',userController.getUserByID)
usersRouter.put('/:userId',userController.updateUser)
usersRouter.delete('/:userId',userController.removeUser)
usersRouter.post('/auth/log-in',userController.logInUser)
usersRouter.get('/auth/log-out',userController.signOutUser)
usersRouter.post('/dashboard',protect,userController.getUserDashboard)


module.exports=usersRouter