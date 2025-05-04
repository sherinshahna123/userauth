const express = require('express')
const router = express.Router();
const adminController = require('../controller/adminController')
const adminAuth = require('../middleware/adminAuth')


router.get("/login",adminAuth.isAdmin,adminController.loadLogin)
router.post('/login',adminController.login)
router.get('/dashboard',adminAuth.isLogout,adminController.loadDashboard)
router.post('/edit-user',adminController.editUser)
router.get('/delete-user/:id',adminAuth.isLogout,adminController.deleteUser)
router.post('/add-user',adminController.addUser)
router.get('/logout',adminAuth.isLogout,adminController.logout)



module.exports = router