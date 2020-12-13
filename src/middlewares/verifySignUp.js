const User = require("../models/User");
const Role = require("../models/Role");

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

checker.checkRolesExisted = async (req, res, next) => {
  ROLES = await Role.distinct("name");
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).json({
          message: `Role ${req.body.roles[i]} does not exist`,
        });
      }
    }
  }
  next();
};

module.exports = checker;
