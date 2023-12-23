const User = require('../../models/user/userModel'),
      catchAsync = require('../../util/catchAsync')  

exports.isUserBlocked = catchAsync(async(req,res,next)=>{
    const user = await User.findById(req.userId)
    if(user.isBlocked){
        return res.json({error:'blocked'})
    }else{
        next()
    }
})
