const { Router } = require("express");
const router = Router();

const {
  addAuthorRequest,
  getAuthorRequest,
  getAllAuthorRequest,
  removeAuthorRequest,
} = require("../controllers/authorRequest.controller");

const { isAuthenticated } = require("../helpers/authenticated");

router.route("/add-author-request").post(isAuthenticated, addAuthorRequest);

router
  .route("/get-author-request/:userId")
  .get(isAuthenticated, getAuthorRequest);
router
  .route("/get-all-author-requests")
  .get(isAuthenticated, getAllAuthorRequest);
router
  .route("/remove-author-request")
  .post(isAuthenticated, removeAuthorRequest);

module.exports = router;
