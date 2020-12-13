const User = require("../models/User");

const checker = {};

checker.checkDuplicateEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email1: req.body.email1 });
    if (user)
      return res.status(400).json({ message: "The email already exists" });
    next();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = checker;
