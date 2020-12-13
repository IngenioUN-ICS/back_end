const { Router } = require("express");
const passport = require("passport");
const router = Router();

const { signup, signin, signout } = require("../controllers/user.controller");

const { isLogged, isAuthenticated } = require("../helpers/authenticated");

router.route("/signup").post(isLogged, signup);

router.route("/signin").post(isLogged, signin);

router.route("/signout").get(isAuthenticated, signout);

module.exports = router;
