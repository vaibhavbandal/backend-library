const jwt=require('jsonwebtoken');


exports.getToken= (user)=>{
    const token= jwt.sign({
        ID:user._id,email:user.email,type:user.type
    },process.env.SECRET)

    return token;
}


exports.varifyToken=(req,res,next)=>{

    const token = req.header("Authorization");
    if(!token){
        return res.status(401).json({
            code : "JWT_NOT_FOUND",
            message : "JWT was not present in header"
        });
    }
    if(!token.startsWith("Bearer ")){
        return res.status(401).json({
            code : "JWT_FORMAT_ERROR",
            message : "JWT has not been passed with proper format in header"
        });
    }

    const jwtVerify = jwt.verify(token.substring(7,token.length),process.env.SECRET);
    if(jwtVerify.type==='ADMIN'||jwtVerify.type==='LIBRARIAN'){
        req.user=jwtVerify;
        next();
    }else{
        return res.status(401).json({
            code : "UNAUTHORISED_USER",
            message : "You are not admin or librarian"
        });
    }

}

exports.varifyTokenForStudent=(req,res,next)=>{

    const token = req.header("Authorization");
    if(!token){
        return res.status(400).json({
            code : "JWT_NOT_FOUND",
            message : "JWT was not present in header"
        });
    }
    if(!token.startsWith("Bearer ")){
        return res.status(401).json({
            code : "JWT_FORMAT_ERROR",
            message : "JWT has not been passed with proper format in header"
        });
    }



    const jwtVerify = jwt.verify(token.substring(7,token.length),process.env.SECRET);
    if(jwtVerify.type==='STUDENT'){
        req.user=jwtVerify;
        next();
    }else{
        return res.status(401).json({
            code : "UNAUTHORISED_USER",
            message : "You are not Student"
        });
    }

}