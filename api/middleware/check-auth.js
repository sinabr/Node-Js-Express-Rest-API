const jwt = require('jsonwebtoken');
const Admin = require('../model/admin')
// const User = require('../model/user')

module.exports = (req , res , next)=>{
    try{
        console.log(req)
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        console.log(decoded)
        if(decoded.ref === "admin"){

            Admin.findById(decoded.adminId).lean().exec()
            .then(admin=>{
                console.log(admin)
                if(admin.logged){
                    req.adminData = decoded
                    req.userData = null
                    next();
                }else{
                    res.status(401).send("Authentication Check Failed")
                }
            }).catch(err=>{console.log(err);res.status(401).send("Authentication Check Failed")})
        
        }
        if(decoded.ref === "user") {

            User.findById(decoded.userId).lean().exec()
            .then(user=>{
                if(user.logged){
                    req.adminData = null
                    req.userData = decoded
                    next();
                }else{
                    res.status(401).send("Authentication Check Failed")
                
                }
            }).catch(err=>{console.log(err);res.status(401).send("Authentication Check Failed")})
        }

    }catch(error){
        return res.status(401).send("Authentication Check Failed")
    }   
    
};