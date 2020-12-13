const { Router } = require("express");
const router = Router();

const sessionCtrl = require("../controllers/user.controller");
const checker = require("../middlewares/verifySignUp")

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post(
  "/signup",
  [checker.checkDuplicateEmail , checker.checkRolesExisted],
  sessionCtrl.signUp
);

router.post("/signin", sessionCtrl.signin);

module.exports = router;
