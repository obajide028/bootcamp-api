const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


//@desc     Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async(req, res, next) => {
    const { name, email, password, role } = req.body ;

      // create user
    const user = await User.create({name, email, password, role});
    
    // create token 
    const token = user.getSignedJwtToken();
    

    res.status(200).json({ success: true, token });
});


//@desc     Register user
// @route   GET /api/v1/auth/register
// @access  Public
exports.login = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body ;

    // validate email & password
    if(!email || !password){
        return next(new ErrorResponse('Please provide an email and password', 400));
    }
 
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if(!user){
        return next(new ErrorResponse('Invalid credentials', 401));
    }   
    
    // check if password matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return next(new ErrorResponse('Invalid credentials', 401));
    };
    
    // create token 
    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token });
});