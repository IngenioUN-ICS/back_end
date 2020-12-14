const { Router } = require("express");
const router = Router();

const authentication = require("../middlewares/authJwt");
const userCtrl = require("../controllers/user.controller");
const notifCtrl = require("../controllers/notification.controller");

router.get("/get-random-users/:role/:categoryId", userCtrl.getRandomUsers);
router.get(
  "/get-user-categories/:userId",
  authentication.verifyToken,
  userCtrl.getAllUserCategories
);

router.get(
  "/get-following/:userId",
  authentication.verifyToken,
  userCtrl.getAllFollowings
);

router.get(
  "/get-user-authors/:userId",
  authentication.verifyToken,
  userCtrl.getAllUserAuthors
);

router.get(
  "/get-followers/:userId",
  authentication.verifyToken,
  userCtrl.getAllFollowers
);

router.put(
  "/add-author",
  [authentication.verifyToken, authentication.isAdmin, userCtrl.addAuthor],
  notifCtrl.createSubscribers
);

router.get(
  "/get-users",
  [authentication.verifyToken, authentication.isAdmin],
  userCtrl.getAllUsers
);

router.get(
  "/get-authors",
  [authentication.verifyToken, authentication.isAdmin],
  userCtrl.getAllAuthors
);

router.post(
  "/add-save-publication",
  authentication.verifyToken,
  userCtrl.addMySavePublications
);

router.get(
  "/get-save-publication",
  authentication.verifyToken,
  userCtrl.getAllSavedPublications
);

router.get(
  "/get-personal-data/:userId",
  authentication.verifyToken,
  userCtrl.getPersonalData
);

router.post(
  "/start-following",
  [authentication.verifyToken, userCtrl.startFollowing],
  notifCtrl.subscribe
);

router.post(
  "/stop-following",
  [authentication.verifyToken, userCtrl.stopFollowing],
  notifCtrl.unsubscribe
);

router.get(
  "/get-author-publications/:authorId",
  authentication.verifyToken,
  userCtrl.getAuthorPublications
);

module.exports = router;
