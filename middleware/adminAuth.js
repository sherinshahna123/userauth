

const isAdmin = async (req,res,next)=>{
    try {
        console.log('req.session.admin from the admin auth middleware:',req.session.admin);
        if(req.session.admin){
            res.redirect('/admin/dashboard');
        }else{
            next();
        }
    } catch (error) {
        console.log('error occured',error);
    }
}


const isLogout = async(req,res,next)=>{
    try{
        if(req.session.admin){
            next();
        }else{
            res.redirect('/admin/login');
        }
    }catch (error) {
        console.log('error occured',error);
    }
}


module.exports = {isAdmin,isLogout}