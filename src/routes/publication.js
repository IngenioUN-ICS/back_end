const { Router } = require("express");
const router = Router();

const authentication = require("../middlewares/authJwt");
const publicationCtrl = require("../controllers/publication.controller");
const userCtrl = require("../controllers/user.controller");
const notifCtrl = require("../controllers/notification.controller");
const categoryCtrl = require("../controllers/category.controller");

router.get("/get-publication/:publicationId", publicationCtrl.getPublication);

router.get(
  "/get-all-publications/:categoryId",
  publicationCtrl.getSummaryOfPublications
);

router.post(
  "/add-publication",
  [
    authentication.verifyToken,
    authentication.isAuthor,
    publicationCtrl.addPublication,
    userCtrl.addPublicationToAuthor,
    notifCtrl.updateNotifications,
  ],
  categoryCtrl.updatePublications
);

module.exports = router;
