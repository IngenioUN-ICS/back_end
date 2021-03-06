const { Router } = require("express");
const router = Router();

const sessionCtrl = require("../controllers/session.controller");
const checker = require("../middlewares/verifySignUp");
const authentication = require("../middlewares/authJwt");

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post(
  "/signup",
  [authentication.notLogged, checker.checkDuplicateEmail],
  sessionCtrl.signUp
);

router.post("/signin", authentication.notLogged, sessionCtrl.signIn);

router.get("/signout", authentication.verifyToken, sessionCtrl.signOut);

module.exports = router;
