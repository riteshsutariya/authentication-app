//for user authentication
module.exports.isAuth = ((req,res,next)=>{
   if(req.isAuthenticated())
   {
    next();
   }
   else{
    res.status(401).json({message:'You are not authorized to view this resource.'});
   }
})

//for admin authentication
module.exports.isAdmin=((req,res,next)=>{
    if(req.isAuthenticated()&&req.user.admin)
    {
     next();
    }
    else{
     res.status(401).json({message:'You are not authorized to view this resource. 589-Not Admin'});
    }
})