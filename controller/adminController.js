const bcrypt = require('bcrypt')
const userModel = require('../model/userModel')
const flash=require('express-flash')


const loadLogin = async (req,res)=>{
    try {
        res.render('admin/login')
    } catch (error) {
        console.log(error.message);     
    }
}


const login = async (req,res)=>{
    try {
        const {email,password} = req.body

        if(!email || !password){
            req.flash('error_msg','Email and Password is required !!!');
            return res.redirect('/admin/login')
        }


        console.log('req.body:',req.body);
        console.log(email,password);

        //Find admin by email

        const admin = await userModel.findOne({email})

        console.log(admin);


        if(!admin){
            req.flash('error_msg','Admin is not found');
            return res.redirect('/admin/login')
        }

        const isMatch = await bcrypt.compare(password, admin.password)

        if(!isMatch){
            req.flash('error_msg','Password is not match');
            return res.redirect('/admin/login');
        }


        req.session.admin = true
        console.log('request.session:',req.session.admin);

        //Redirect to dashboard after successful login

        return res.redirect('/admin/dashboard')

    } catch (error) {
        
        req.flash('error_msg','Something went wrong. Please try again');
        res.redirect('/admin/login')
    }
}


const loadDashboard = async (req,res)=>{

    if(req.session.admin){
        try {
            const message=req.flash('message')
            const admin = await userModel.findOne({isAdmin: true});
            console.log('admin:',admin);
            console.log('req.session.admin:',req.session.admin);

            if(!admin){
                req.flash('error_msg','Admin is not found. Please try again')
                return res.redirect('/admin/login');
            }

            const users = await userModel.find({isAdmin:false});

            return res.render('admin/dashboard',{users,message});

        } catch (error) {
            console.log(error);
            req.flash('error_msg','Server Error try again !!!')
            return res.status(500).send('Server Error');
        }
    } else {
        req.flash('error_msg','Login failed... Try again')
        return res.redirect('/admin/login');
    }
}


const editUser = async (req,res)=>{
    try {
        const {email,password,id} = req.body
        const hashedPassword = await bcrypt.hash(password,10)

        const user = await userModel.findOneAndUpdate({_id:id},{$set:{email,password:hashedPassword}})
        req.flash("message","Edited successfully")
        res.redirect('/admin/dashboard')

    } catch (error) {
        console.log(error);
    }
}


const deleteUser = async (req,res)=>{
    try {

        const {id} = req.params
        const user = await userModel.findByIdAndDelete({_id:id})
        req.flash("message","Deleted successfully")
        res.redirect('/admin/dashboard')

    } catch (error) {

        console.log(error);

    }
}


const addUser = async (req,res) =>{
    try {
        const {email,password} = req.body
         const user = await userModel.findOne({email})
        
                if(user) {
                    req.flash('message',"User already registered")
                    return res.redirect('/admin/dashboard')
                }

        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = new userModel({
            email,
            password: hashedPassword
        })

        await newUser.save()
        req.flash("message","User Added")
        res.redirect('/admin/dashboard')

    } catch (error) {

        console.log(error); 

    }
}


const logout = async (req,res) =>{

    req.session.admin = null
    res.redirect('/admin/login')

}


module.exports = {loadLogin,login,loadDashboard,editUser,deleteUser,addUser,logout}