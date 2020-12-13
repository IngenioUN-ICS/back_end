const { Router } = require("express");
const router = Router();

const notificationCtrl = require("../controllers/notification.controller");
const authentication = require("../middlewares/authJwt");

router.get(
  "/get-notifications/:authorId/:categoryId",
  authentication.verifyToken,
  notificationCtrl.getAllNotifications
);

router.post(
  "/remove-notification",
  authentication.verifyToken,
  notificationCtrl.removeNotification
);

router.route(
  "/remove-all-notifications",
  authentication.verifyToken,
  notificationCtrl.removeAllNotifications
);

module.exports = router;
