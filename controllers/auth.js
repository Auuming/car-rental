const User = require("../models/User");
const RentalCarProvider = require("../models/RentalCarProvider");
const { Resend } = require("resend");
const jwt = require("jsonwebtoken");

//@desc    Register user
//@route   POST /api/v1/auth/register
//@access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, telephone, email, password, role } = req.body;

    //Create user
    const user = await User.create({
      name,
      telephone,
      email,
      password,
      role,
    });

    //Create token
    // const token=user.getSignedJwtToken();
    // res.status(200).json({success:true, token:token});
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err });
    console.log(err.stack);
  }
};

//@desc Login user
//@route POST /api/v1/auth/login
//@access Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //Validate email & password
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide an email and password" });
    }

    //Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid credentials" });
    }

    //Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials" });
    }

    //Create token
    // const token=user.getSignedJwtToken();
    // res.status (200).json({success:true, token});
    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res
      .status(401)
      .json({
        success: false,
        msg: "Cannot convert email or password to string",
      });
  }
};

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res
    .status(statusCode) /*.cookie('token',token,options)*/
    .json({
      success: true,
      //add for frontend
      _id: user._id,
      name: user.name,
      email: user.email,
      //end for frontend
      token: token,
    });
};

//@desc    Get current Logged in user
//@route   POST /api/vl/auth/me
//@access  Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
};

//@desc    Log user out / clear cookie
//@route   GET /api/v1/auth/logout
//@access  Private
exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};

//@desc    Forgot password
//@route   POST /api/v1/auth/forgotpassword
//@access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "There is no user with that email",
      });
    }

    //Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    //Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data, error } = await resend.emails.send({
        from: "Rental Car Booking <onboarding@resend.dev>",
        to: user.email,
        subject: "Password Reset Token",
        html: `<strong>Password Reset</strong><p>${message}</p>`,
      });

      if (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return res.status(400).json({ success: false, error });
      }

      res.status(200).json({ success: true, data: "Email sent" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        msg: "Email could not be sent",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

//@desc    Reset password
//@route   PUT /api/v1/auth/resetpassword/:resettoken
//@access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    //Get reset token
    const resetPasswordToken = req.params.resettoken;

    //Verify token
    let decoded;
    try {
      decoded = jwt.verify(resetPasswordToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        msg: "Invalid or expired token",
      });
    }

    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid token",
      });
    }

    //Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

//@desc    Add rental car provider to favorites
//@route   POST /api/v1/auth/favorites/:rentalCarProviderId
//@access  Private
exports.addFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const rentalCarProvider = await RentalCarProvider.findById(req.params.rentalCarProviderId);

    if (!rentalCarProvider) {
      return res.status(404).json({
        success: false,
        msg: "Rental car provider not found",
      });
    }

    //Check if already in favorites
    const favoriteIds = user.favorites.map(fav => fav.toString());
    if (favoriteIds.includes(req.params.rentalCarProviderId)) {
      return res.status(400).json({
        success: false,
        msg: "Rental car provider already in favorites",
      });
    }

    user.favorites.push(req.params.rentalCarProviderId);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.favorites,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

//@desc    Remove rental car provider from favorites
//@route   DELETE /api/v1/auth/favorites/:rentalCarProviderId
//@access  Private
exports.removeFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    //Check if in favorites
    const favoriteIds = user.favorites.map(fav => fav.toString());
    if (!favoriteIds.includes(req.params.rentalCarProviderId)) {
      return res.status(400).json({
        success: false,
        msg: "Rental car provider not in favorites",
      });
    }

    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== req.params.rentalCarProviderId
    );
    await user.save();

    res.status(200).json({
      success: true,
      data: user.favorites,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

//@desc    Get user's favorite rental car providers
//@route   GET /api/v1/auth/favorites
//@access  Private
exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'favorites',
      select: 'name address tel'
    });

    res.status(200).json({
      success: true,
      count: user.favorites.length,
      data: user.favorites,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};