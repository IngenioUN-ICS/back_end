const User = require("../models/User");
const Role = require("../models/Role");
const config = require("../config");
const jwt = require("jsonwebtoken");

const sessionCtrl = {};

sessionCtrl.signUp = async (req, res) => {
  try {
    // Getting the Request Body
    const {
      firstName,
      lastName,
      email1,
      password,
      confirmPassword,
      roles,
    } = req.body;

    // checking data
    if (!firstName || !lastName || !email1 || !password || !confirmPassword)
      return res.status(400).json({ message: "Incomplete data" });

    const newUser = new User(req.body);

    // checking data structure
    const checkEmail = newUser.emailIsValid(email1);
    const checkPassword = newUser.passwordIsValid(password);

    if (!checkEmail)
      return res.status(400).json({ message: "The email format is not valid" });

    if (!checkPassword)
      return res
        .status(400)
        .json({ message: "The password format is not valid" });

    if (password != confirmPassword)
      return res.status(400).json({ message: "Password do not match" });

    newUser.password = await newUser.encryptPassword(password.toString());

    // checking for roles
    if (req.body.roles) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      newUser.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      newUser.roles = [role._id];
    }

    // Create a token
    const token = jwt.sign({ id: newUser._id }, config.SECRET, {
      expiresIn: 86400, // 24 hours
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

sessionCtrl.signIn = async (req, res) => {
  try {
    // Request body email can be an email or username
    const userFound = await User.findOne({ email1: req.body.email1 }).populate(
      "roles"
    );

    if (!userFound) return res.status(400).json({ message: "User Not Found" });

    const match = await userFound.matchPassword(
      req.body.password,
      userFound.password
    );

    if (!match)
      return res.status(401).json({
        token: null,
        message: "Invalid Password",
      });

    const token = jwt.sign({ id: userFound._id }, config.SECRET, {
      expiresIn: 86400, // 24 hours
    });

    res.json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// ! check
sessionCtrl.signOut = (req, res) => {
  try {
    // TODO: complete - delete token from memmemory or use BlackList
    return res.status(200).json({ token: "deleted", message: "Bye" });
  } catch (error) {
    console.log(error);
    //return res.status(400).json(error);
  }
};

module.exports = sessionCtrl;
