const Notification = require("../models/Notification");
const logger = require("../log/facadeLogger");

const notificationCtrl = {};

notificationCtrl.subscribe = async (req, res) => {
  try {
    if (req.user.role == 2) throw "You do not have the required permissions";
    const newNotification = new Notification(req.body);
    newNotification.userId = req.user.id;
    await newNotification.save();

    if (req.body.categoryId) logger.info("User subscribed to a category");
    else if (req.body.authorId) logger.info("User subscribed to an author");
    else throw "Incomplete data";

    return res.status(200).json({
      message: "The subscription has been successful",
    });
  } catch (err) {
    if (!err.message) {
      logger.warn(err);
      return res.status(400).json({ message: err });
    } else {
      logger.error("there is a problem registering subscription notifications");
      return res.status(400).json({
        message: "There was a problem with the requested subscription",
      });
    }
  }
};

notificationCtrl.unsubscribe = async (req, res) => {
  try {
    if (req.user.role == 2) throw "You do not have the required permissions";

    if (req.body.categoryId)
      await Notification.findOneAndRemove({
        categoryId: req.body.categoryId,
        userId: req.user.id,
      });
    else if (req.body.authorId)
      await Notification.findOneAndRemove({
        authorId: req.body.authorId,
        userId: req.user.id,
      });
    else throw "Incomplete data";

    if (req.body.authorId) logger.info("User unsubscribed to an author");
    if (req.body.categoryId) logger.info("User unsubscribed to a category");

    return res.status(200).json({
      message: "The unsubscription has been successful",
    });
  } catch (err) {
    var message;
    if (err.message) {
      if (req.body.categoryId)
        message = "You are not subscribed to this category";
      else message = "You are not subscribed to this author";
      logger.error("User entered an invalid subscription id");
      return res.status(400).json({
        message: message,
      });
    } else {
      logger.warn(err);
      return res.status(400).json({ message: err });
    }
  }
};

notificationCtrl.updateNotifications = async (req, res, next) => {
  try {
    var i, j;
    var notifications = await Notification.find({ authorId: req.user.id });

    if (notifications) {
      for (i = 0; i < notifications.length; i++) {
        notifications[i].listPublications.push(req.body.publicationId);
        await Notification.findByIdAndUpdate(
          notifications[i].id,
          notifications[i]
        );
      }
    }

    for (i = 0; i < req.body.listCategories.length; i++) {
      notifications = await Notification.find({
        categoryId: req.body.listCategories[i],
      });
      if (notifications) {
        for (j = 0; j < notifications.length; j++) {
          notifications[j].listPublications.push(req.body.publicationId);
          await Notification.findByIdAndUpdate(
            notifications[j].id,
            notifications[j]
          );
        }
      }
    }
    return next();
  } catch (err) {
    if (!err.message) {
      logger.warn(err);
      return res.status(400).json({ message: err });
    } else {
      logger.error("User entered an invalid category ID");
      return res.status(400).json({
        message: "Some of the entered categories does not exist",
      });
    }
  }
};

notificationCtrl.removeNotification = async (req, res) => {
  try {
    if (req.user.role == 2) throw "You do not have the required permissions";

    if (req.body.notificationId)
      if (req.body.publicationId) {
        const notification = await Notification.findById(
          req.body.notificationId
        );
        for (var i = 0; i < notification.listPublications.length; i++) {
          if (notification.listPublications[i] == req.body.publicationId) {
            notification.listPublications.splice(i, 1);
            break;
          }
        }
        await Notification.findByIdAndUpdate(notification.id, notification);
      } else throw "Incomplete data";

    logger.info("The user successfully removed the notification");
    return res.status(200).json({
      message: "Notification successfully removed",
    });
  } catch (err) {
    if (!err.message) {
      logger.warn(err);
      return res.status(400).json({ message: err });
    } else {
      logger.error("The user entered a wrong id");
      return res.status(400).json({
        message:
          "The notification you are trying to subscribe to does not exist",
      });
    }
  }
};

notificationCtrl.removeAllNotifications = async (req, res) => {
  try {
    if (req.user.role == 2) throw "You do not have the required permissions";

    if (req.body.notificationId)
      var notification = await Notification.findById(req.body.notificationId);
    else throw "Incomplete data";
    notification.listPublications = [];
    await Notification.findByIdAndUpdate(notification.id, notification);
    logger.info("The user successfully removed the notifications");
    return res.status(200).json({
      message: "Notifications successfully removed",
    });
  } catch (err) {
    if (!err.message) {
      logger.warn(err);
      return res.status(400).json({ message: err });
    } else {
      logger.error("The user entered a wrong id");
      return res.status(400).json({
        message: "The notifications you are trying to delete does not exist",
      });
    }
  }
};

notificationCtrl.getAllNotifications = async (req, res, next) => {
  try {
    var notification;
    if (req.user.role == 2) throw "You do not have the required permissions";

    if (req.params.authorId != "null") {
      notification = await Notification.findOne(
        {
          authorId: req.params.authorId,
          userId: req.user.id,
        },
        { id: 1 }
      ).populate({
        path: "listPublications",
        select: ["title", "listCategories"],
        populate: [
          { path: "listCategories", select: "name" },
          { path: "authorId", select: ["firstName", "lastName"] },
        ],
      });
    } else if (req.params.categoryId != "null") {
      notification = await Notification.findOne(
        {
          categoryId: req.params.categoryId,
          userId: req.user.id,
        },
        { id: 1 }
      ).populate({
        path: "listPublications",
        select: ["title", "listCategories"],
        populate: [
          { path: "listCategories", select: "name" },
          { path: "authorId", select: ["firstName", "lastName"] },
        ],
      });
    } else throw "Incomplete data";

    if (!notification) {
      logger.error("User has no pending notifications");
      return res.status(400).json({
        message: "You have no notifications",
      });
    }

    logger.info("Notifications were successfully returned");
    return res.status(200).json(notification);
  } catch (err) {
    if (!err.message) {
      logger.warn(err);
      return res.status(400).json({ message: err });
    } else {
      logger.error("There is a problem with the database");
      return res.status(400).json({
        message: "Could not retrieve notifications",
      });
    }
  }
};

notificationCtrl.createSubscribers = async (req, res) => {
  try {
    var newNotification;

    for (var i = 0; i < req.body.followers.length; i++) {
      newNotification = new Notification();
      newNotification.authorId = req.body.userId;
      newNotification.userId = req.body.followers[i];
      await newNotification.save();
    }

    logger.info("User successfully switched roles");
    return res.status(200).json({
      message: "You are now a IngenioUN author",
    });
  } catch (err) {
    if (!err.message) {
      logger.warn(err);
      return res.status(400).json({ message: err });
    } else {
      logger.error("there are problems with your followers");
      return res.status(400).json({
        message: "there are problems with your followers",
      });
    }
  }
};

module.exports = notificationCtrl;
