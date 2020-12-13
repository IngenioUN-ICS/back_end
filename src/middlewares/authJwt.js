const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/User");
const Role = require("../models/Role");

export const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, config.SECRET);
    req.userId = decoded.id;

    const user = await User.findById(req.userId, { password: 0 });
    if (!user) return res.status(404).json({ message: "No user found" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
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

export const isAuthor = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
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

export const isUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
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
