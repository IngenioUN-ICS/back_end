const User = require("../models/User");
const logger = require("../log/facadeLogger");
const Category = require("../models/Category");
const AuthorRequest = require("../models/AuthorRequest");
const authentication = require("../middlewares/authJwt");

const usersCtrl = {};

usersCtrl.addAuthor = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) throw "Incomplete data";
    const request = await AuthorRequest.findOne({ userId: userId });

    if (!request) throw "No exist request";
    var user = await User.findById(userId);
    if (!user) throw "no exits";

    if (user.roles.includes("author")) throw "You are already an author";

    var user2;
    for (var i = 0; i < user.followers.length; i++) {
      user2 = await User.findById(user.followers[i]);

      for (var j = 0; j < user2.following.length; j++) {
        if (user2.following[j] == user.id) {
          user2.following.splice(i, 1);
          break;
        }
      }
      user2.subscriptionToAuthors.push(user.id);
      await User.findByIdAndUpdate(user2.id, user2);
    }

    user.roles.push("author");
    user.roles = user.roles.filter(e => e !== "user");
    user.email2 = request.email2;
    user.professionalCard = request.professionalCard;
    user.employmentHistory = request.employmentHistory;
    user.academicHistory = request.academicHistory;

    await User.findByIdAndUpdate(userId, user);

    req.body.followers = user.followers;
    return next();
  } catch (err) {
    if (!err.message) {
      logger.warn(err);
      return res.status(400).json({ message: err });
    } else {
      logger.error("Problem with the database");
      return res.status(400).json({
        message: err.message,
      });
    }
  }
};

usersCtrl.getAllUsers = async (req, res) => {
  try {
    const user = await User.find({ role: 0 }).select([
      "firstName",
      "lastName",
      "email1",
    ]);

    logger.info(
      "The requests requested by the user have been successfully retrieved"
    );
    return res.status(200).json(user);
  } catch (err) {
    if (!err.message) {
      logger.warn(err);
      return res.status(400).json({ message: err });
    } else {
      logger.error(
        "A problem occurred while trying to retrieve requests for authorship"
      );
      return res.status(400).json({
        message: "Could not access",
      });
    }
  }
};

usersCtrl.getAllAuthors = async (req, res) => {
  try {
    const author = await User.find({ role: 1 }).select([
      "firstName",
      "lastName",
      "myPublications",
    ]);
    logger.info(
      "The requests requested by the user have been successfully retrieved"
    );
    return res.status(200).json(author);
  } catch (err) {
    if (!err.message) {
      logger.warn(err);
      return res.status(400).json({ message: err });
    } else {
      logger.error(
        "A problem occurred while trying to retrieve requests for authorship"
      );
      return res.status(400).json({
        message: "Could not access",
      });
    }
  }
};

usersCtrl.addPublicationToAuthor = async (req, res, next) => {
  try {
    var user = await User.findById(req.user.id);
    user.myPublications.push(req.body.publicationId);
    await User.findByIdAndUpdate(user.id, user);
    return next();
  } catch (err) {
    if (!err.message) {
      logger.warn(err);
      return res.status(400).json({ message: err });
    } else {
      console.log(err);
      logger.error("There is a problem adding the post to the author list");
      return res.status(400).json({
        message: "There is a problem adding the post to your post list",
      });
    }
  }
};

usersCtrl.addMySavePublications = async (req, res) => {
  try {
    var user = await User.findById(req.user.id);
    for (var i = 0; i < user.savedPublications.length; i++) {
      if (req.body.publicationId == user.savedPublications[i])
        throw "you already saved this publication";
    }
    user.savedPublications.push(req.body.publicationId);
    await User.findByIdAndUpdate(req.user.id, user);

    logger.info("User successfully save a publication");
    return res.status(200).json({
      message: "The publication was successfully added",
    });
  } catch (err) {
    logger.error("add publication not completed");
    return res.status(400).json({
      message: "This publication is already in your save pubublications",
    });
  }
};

usersCtrl.getAllSavedPublications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "savedPublications",
        select: ["title", "listCategories", "abstract", "authorId"],
      })
      .select("savedPublications");
    logger.info(
      "The requests requested by the user have been successfully retrieved"
    );
    return res.status(200).json(user);
  } catch (err) {
    if (!err.message) {
      logger.warn(err);
      return res.status(400).json({ message: err });
    } else {
      logger.error(
        "A problem occurred while trying to retrieve requests for authorship"
      );
      return res.status(400).json({
        message: "Could not access",
      });
    }
  }
};

usersCtrl.getAllUserCategories = async (req, res) => {
  try {
    var categories;
    if (req.params.userId != "null")
      categories = await User.findById(req.params.userId).select(
        "subscriptionToCategories"
      );
    else
      categories = await User.findById(req.user.id).select(
        "subscriptionToCategories"
      );

    var categoryId, i;
    var category = {};
    var listCategories = [];
    for (i in categories["subscriptionToCategories"]) {
      categoryId = categories["subscriptionToCategories"][i];
      category = await Category.findById(categoryId)
        .lean()
        .select(["name", "description", "publications"]);
      category.isSubscribed = 1;
      listCategories.push(category);
    }
    logger.info(
      "The requests requested by the user have been successfully retrieved"
    );
    return res.status(200).json(listCategories);
  } catch (err) {
    if (!err.message) {
      logger.warn(err);
      return res.status(400).json({ message: err });
    } else {
      logger.error(
        "A problem occurred while trying to retrieve requests for all user categories"
      );
      return res.status(400).json({
        message: "Could not access",
      });
    }
  }
};

usersCtrl.getAllFollowings = async (req, res) => {
  try {
    var followings;
    if (req.params.userId != "null")
      followings = await User.findById(req.params.userId).select("following");
    else followings = await User.findById(req.user.id).select("following");

    var followingId, i, j;
    var following = {};
    var listFollowings = [];
    for (i in followings["following"]) {
      followingId = followings["following"][i];
      following = await User.findById(followingId)
        .lean()
        .select(["firstName", "lastName", "followers", "role"]);
      following.isFollowedByThisUser = 0;
      for (j in following["followers"]) {
        if (following["followers"][j] == req.user.id)
          following.isFollowedByThisUser = 1;
      }
      listFollowings.push({
        _id: following._id,
        firstName: following.firstName,
        lastName: following.lastName,
        isFollowing: following.isFollowedByThisUser,
        role: following.role,
      });
    }
    logger.info(
      "The requests requested by the user have been successfully retrieved"
    );
    return res.status(200).json(listFollowings);
  } catch (err) {
    if (!err.message) {
      logger.warn(err);
      return res.status(400).json({ message: err });
    } else {
      logger.error(
        "A problem occurred while trying to retrieve requests for all user followings"
      );
      return res.status(400).json({
        message: "Could not access",
      });
    }
  }
};

usersCtrl.getAllFollowers = async (req, res) => {
  try {
    var followers;
    if (req.params.userId != "null")
      followers = await User.findById(req.params.userId).select("followers");
    else followers = await User.findById(req.user.id).select("followers");

    var followerId, i, j;
    var follower = {};
    var listFollowers = [];
    for (i in followers["followers"]) {
      followerId = followers["followers"][i];
      follower = await User.findById(followerId)
        .lean()
        .select(["firstName", "lastName", "following", "role"]);
      follower.isFollowingThisUser = 0;
      for (j in follower["following"]) {
        if (follower["following"][j] == req.user.id)
          follower.isFollowingThisUser = 1;
      }
      listFollowers.push({
        _id: follower._id,
        firstName: follower.firstName,
        lastName: follower.lastName,
        isFollowing: follower.isFollowingThisUser,
        role: follower.role,
      });
    }
    logger.info(
      "The requests requested by the user have been successfully retrieved"
    );
    return res.status(200).json(listFollowers);
  } catch (err) {
    if (!err.message) {
      logger.warn(err);
      return res.status(400).json({ message: err });
    } else {
      logger.error(
        "A problem occurred while trying to retrieve requests for all user followers"
      );
      return res.status(400).json({
        message: "Could not access",
      });
    }
  }
};

usersCtrl.getAllUserAuthors = async (req, res) => {
  try {
    var authors;
    if (req.params.userId != "null")
      authors = await User.findById(req.params.userId).select(
        "subscriptionToAuthors"
      );
    else
      authors = await User.findById(req.user.id).select(
        "subscriptionToAuthors"
      );

    var authorId, i;
    var author = {};
    var listAuthors = [];
    for (i in authors["subscriptionToAuthors"]) {
      authorId = authors["subscriptionToAuthors"][i];
      author = await User.findById(authorId)
        .lean()
        .select(["firstName", "lastName", "myPublications"]);
      author.publications = author.myPublications.length;
      author.myPublications = null;
      author.isSubscribed = 1;
      listAuthors.push(author);
    }
    logger.info(
      "The requests requested by the user have been successfully retrieved"
    );
    return res.status(200).json(listAuthors);
  } catch (err) {
    if (!err.message) {
      logger.warn(err);
      return res.status(400).json({ message: err });
    } else {
      logger.error(
        "Some of the ids in the subscription list Authors do not match a registered user"
      );
      return res.status(400).json({
        message:
          "The author you are trying to follow does not exist on the platform",
      });
    }
  }
};

// Any type of user can access this information
usersCtrl.getAuthorPublications = async (req, res) => {
  try {
    var tempId;
    if (req.params.authorId != "null") tempId = req.params.authorId;
    else tempId = req.user.id;

    const author = await User.findById(tempId, {
      myPublications: 1,
      role: 1,
    }).populate({
      path: "myPublications",
      select: ["title", "abstract", "listCategories", "listCategories"],
      populate: {
        path: "listCategories",
        select: "name",
      },
    });

    if (author.role != 1) throw "This user is not an author";

    return res.status(200).json(author.myPublications);
  } catch (err) {
    if (!err.message) {
      logger.warn(err);
      return res.status(400).json({ message: err });
    } else {
      logger.error("The entered id does not belong to any user");
      return res.status(400).json({
        message: "The author you are trying to consult does not exist",
      });
    }
  }
};

// Any type of user can access this information
usersCtrl.getPersonalData = async (req, res) => {
  try {
    var tempId, isFollowing;
    if (req.params.userId != "null") tempId = req.params.userId;
    else tempId = req.user.id;

    var user = await User.findById(tempId);

    if (req.params.userId != "null") {
      const userLoggedIn = await User.findById(req.user.id);

      if (user.roles.includes("user"))
        isFollowing = userLoggedIn.following.includes(user.id);
      else isFollowing = userLoggedIn.subscriptionToAuthors.includes(user.id);

      if (isFollowing) user.isFollowing = 1;
      else user.isFollowing = 0;
    }

    logger.info("The required data has been successfully obtained");
    return res.status(200).json({
      id: user.id,
      // ! check
      role: user.roles,
      firstName: user.firstName,
      lastName: user.lastName,
      email1: user.email1,
      description: user.description,
      isFollowing: user.isFollowing,
    });
  } catch (err) {
    if (!err.message) {
      logger.warn(err);
      return res.status(400).json({ message: err });
    } else {
      logger.warn("The data you are requesting does not exist on the platform");
      return res.status(400).json({
        message: "The user is not registered on the platform",
      });
    }
  }
};

usersCtrl.startFollowing = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (req.body.categoryId) {
      // for category subscription
      if (user.subscriptionToCategories.includes(req.body.categoryId))
        throw "You are already subscribed to this category";

      user.subscriptionToCategories.push(req.body.categoryId);
      await User.findByIdAndUpdate(req.user.id, user);
      return next();
    } else if (req.body.authorId) {
      //for author subscription
      if (user.subscriptionToAuthors.includes(req.body.authorId))
        throw "You are already subscribed to this author";

      if (req.body.authorId == req.user.id)
        throw "You can't subscribe to yourself";

      const tempUser = await User.findById(req.body.authorId);

      user.subscriptionToAuthors.push(req.body.authorId);
      await User.findByIdAndUpdate(req.user.id, user);
      return next();
    } else if (req.body.userId) {
      // follow user
      if (user.following.includes(req.body.userId))
        throw "You are already following this user";

      if (req.body.userId == req.user.id) throw "You can't follow yourself";

      user.following.push(req.body.userId);
      await User.findByIdAndUpdate(req.user.id, user);

      const otherUser = await User.findById(req.body.userId); //update followers list of the following user
      otherUser.followers.push(req.user.id);
      await User.findByIdAndUpdate(req.body.userId, otherUser);

      logger.info("User now following another user");
      return res.status(200).json({
        message: "Now you follow a new user!",
      });
    } else throw "Incomplete data";
  } catch (err) {
    if (!err.message) {
      logger.warn(err);
      return res.status(400).json({ message: err });
    } else {
      var message;
      logger.error("The user entered a wrong id");
      if (req.body.categoryId)
        message = "The category you are trying to subscribe to does not exist";
      else if (req.body.authorId)
        message = "The author you are trying to subscribe to does not exist";
      else if (req.body.userId)
        message = "The user you are trying to follow does not exist";
      return res.status(400).json({
        message: message,
      });
    }
  }
};

usersCtrl.stopFollowing = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    var i = 0;
    if (req.body.authorId) {
      //for author unsubscription
      if (!user.subscriptionToAuthors.includes(req.body.authorId))
        throw "You are not subscribed to this Author";

      for (i = 0; i < user.subscriptionToAuthors.length; i++) {
        if (user.subscriptionToAuthors[i] == req.body.authorId) {
          user.subscriptionToAuthors.splice(i, 1);
          break;
        }
      }
      await User.findByIdAndUpdate(req.user.id, user);
      return next();
    } else if (req.body.categoryId) {
      // for category unsubscription
      if (!user.subscriptionToCategories.includes(req.body.categoryId))
        throw "You are not subscribed to this category";

      for (i = 0; i < user.subscriptionToCategories.length; i++) {
        if (user.subscriptionToCategories[i] == req.body.categoryId) {
          user.subscriptionToCategories.splice(i, 1);
          break;
        }
      }
      await User.findByIdAndUpdate(req.user.id, user);
      return next();
    } else if (req.body.userId) {
      // stop following user
      if (!user.following.includes(req.body.userId))
        throw "You are already not following this user";

      for (i = 0; i < user.following.length; i++) {
        if (user.following[i] == req.body.userId) {
          user.following.splice(i, 1);
          break;
        }
      }
      await User.findByIdAndUpdate(req.user.id, user);

      const otherUser = await User.findById(req.body.userId); //update followers list of the following user
      for (i = 0; i < otherUser.followers.length; i++) {
        if (otherUser.followers[i] == user.id) {
          otherUser.followers.splice(i, 1);
          break;
        }
      }
      await User.findByIdAndUpdate(req.body.userId, otherUser);
      logger.info("User stopped following another");
      return res.status(200).json({
        message: "You stopped following the user successfully",
      });
    }
    throw "Incomplete data";
  } catch (err) {
    if (!err.message) {
      logger.warn(err);
      return res.status(400).json({ message: err });
    } else {
      var message;
      logger.error("The user entered a wrong id");
      if (req.body.authorId)
        message = "The author you are trying to unsubscribe to does not exist";
      if (req.body.categoryId)
        message =
          "The category you are trying to unsubscribe to does not exist";
      else if (req.body.userId)
        message = "The user you are trying to stop following does not exist";
      return res.status(400).json({
        message: message,
      });
    }
  }
};

usersCtrl.getRandomUsers = async (req, res) => {
  try {
    var users = {};
    var response = [];
    var userLoggedIn;
    var random = 0;
    var isFollowing = true;

    if (req.params.role != "null") {
      if (req.params.categoryId != "null") {
        users = await User.find({
          role: req.params.role,
          subscriptionToCategories: req.params.categoryId,
        })
          .lean()
          .select(["role", "firstName", "lastName", "description"]);
      } else {
        users = await User.find({
          role: req.params.role,
        })
          .lean()
          .select(["role", "firstName", "lastName", "description"]);
      }
    }

    if (users.length < 10) {
      if (authentication.verifyToken()) {
        userLoggedIn = await User.findById(req.user.id);
        console.log(userLoggedIn);
        for (let i = 0; i < users.length; i++) {
          if (req.params.role == 0)
            isFollowing = userLoggedIn.following.includes(users[i]._id);
          else
            isFollowing = userLoggedIn.subscriptionToAuthors.includes(
              users[i]._id
            );

          if (isFollowing) users[i].isFollowing = 1;
          else users[i].isFollowing = 0;
        }
      }
      logger.info("All the users from this role has been returned");
      return res.status(200).json(users);
    } else {
      while (response.length < 10) {
        random = Math.floor(Math.random() * users.length);
        if (authentication.verifyToken()) {
          userLoggedIn = await User.findById(req.user.id);
          if (req.params.role == 0)
            isFollowing = userLoggedIn.following.includes(users[random]._id);
          else
            isFollowing = userLoggedIn.subscriptionToAuthors.includes(
              users[random]._id
            );

          if (isFollowing) users[random].isFollowing = 1;
          else users[random].isFollowing = 0;
        }
        if (!response.includes(users[random])) {
          response.push(users[random]);
        }
      }
      logger.info("Returned 10 random users from this Role");
      return res.status(200).json(response);
    }
  } catch (err) {
    logger.error("The Role id does not exist");
    return res.status(400).json({
      message: "The Role Id does not exist",
    });
  }
};

module.exports = usersCtrl;
