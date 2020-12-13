const { Router } = require("express");
const router = Router();

const authReqqCtrl = require("../controllers/authorRequest.controller");
const authentication = require("../middlewares/authJwt");

router.post(
  "/add-author-request",
  [authentication.verifyToken, authentication.isAuthor],
  authReqqCtrl.addAuthorRequest
);

router.get(
  "/get-author-request/:userId",
  [authentication.verifyToken, authentication.isAdmin],
  authReqqCtrl.getAuthorRequest
);
router.get(
  "/get-all-author-requests",
  [authentication.verifyToken, authentication.isAdmin],
  authReqqCtrl.getAllAuthorRequest
);
router.post(
  "/remove-author-request",
  [authentication.verifyToken, authentication.isAdmin],
  authReqqCtrl.removeAuthorRequest
);

module.exports = router;
