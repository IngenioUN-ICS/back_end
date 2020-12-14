const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/User");
const Role = require("../models/Role");

const authenticatorCrtl = {};

authenticatorCrtl.verifyToken = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];

    if (!token) return res.status(403).json({ message: "No token provided" });
    const decoded = jwt.verify(token, config.SECRET);
    req.user = {};
    req.user.id = decoded.id;

    const user = await User.findById(req.user.id, { password: 0 });
    if (!user) return res.status(404).json({ message: "No user found" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

authenticatorCrtl.isAuthenticated = (req, res, next) => {
  // TODO: to get better
  return req.headers["x-access-token"] ? true : false;
};

authenticatorCrtl.notLogged = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];

    if (!token) return next();

    jwt.verify(token, config.SECRET, (err, next) => {
      if (err) throw err;
    });
    const decoded = jwt.verify(token, config.SECRET);
    const user = await User.findById(decoded.id, { password: 0 });
    if (user) return res.status(404).json({ message: "You are already logged in" });

    next();
  } catch (error) {
    return res.status(401).json({ error });
  }
}

authenticatorCrtl.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const roles = await Role.find({ _id: { $in: user.roles } });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "administrator") {
        next();
        return;
      }
    }

    return res.status(403).json({ message: "Require Admin Role" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
};

authenticatorCrtl.isAuthor = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const roles = await Role.find({ _id: { $in: user.roles } });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "author") {
        next();
        return;
      }
    }

    return res.status(403).json({ message: "Require Author Role" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
};

authenticatorCrtl.isUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const roles = await Role.find({ _id: { $in: user.roles } });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "user") {
        next();
        return;
      }
    }

    return res.status(403).json({ message: "Require User Role" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
};

module.exports = authenticatorCrtl;
