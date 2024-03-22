const sendMail = require("../helper/sendMail");
const userModel = require("../models/userModel");

//REGISTER
exports.registerContoller = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //exisitng user
    const exisitingEmail = await userModel.findOne({ email });
    if (exisitingEmail) {
      return res.status(409).json({
        success: false,
        msg: "Email is already registered. Please Signin to Continue",
      });
    }

    const user = await userModel.create({ username, email, password });
    return res
      .status(201)
      .json({ success: true, msg: "User registered Successfully" });
  } catch (error) {
    console.log(error);
  }
};

//LOGIN
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Email not registered. Please Signup to continue",
      });
    }

    if (user.blocked) {
      const unblockTime = new Date(user.blockedAt.getTime() + 60 * 60 * 1000); // Calculate unblock time
      if (new Date() < unblockTime) {
        return res
          .status(403)
          .json({ success: false, msg: "Account blocked. Try again later." });
      } else {
        user.blocked = false; // Unblock account if unblock time has passed
        user.failedAttempts = 0; // Reset failed attempts
        await user.save();
      }
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      user.failedAttempts++;
      await user.save();

      if (user.failedAttempts === 3) {
        sendMail(
          email,
          "Provide correct password to login",
          `You have written wrong password many times,${password}`
        );
        return res
          .status(199)
          .json({ success: false, msg: "Warning email has been sent" });
      }

      if (user.failedAttempts === 5) {
        user.blocked = true;
        user.blockedAt = new Date();
        await user.save();
        sendMail(
          email,
          "Your account have been blocked",
          `You have written wrong password 5 times`
        );
        return res
          .status(204)
          .json({ success: false, msg: "Account has been blocked" });
      }

      return res
        .status(400)
        .json({ success: false, msg: "Please provide correct password" });
    }
    user.failedAttempts = 0;
    user.blockedAt = null;
    await user.save();
    return res
      .status(200)
      .json({ success: true, msg: "User logged in successfully" });
  } catch (error) {
    console.log(error);
  }
};
