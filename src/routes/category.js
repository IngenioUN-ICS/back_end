const { Router } = require("express");
const router = Router();

const {
  getCategories,
  addCategory,
} = require("../controllers/category.controller");

router.route("/get-all-categories").get(getCategories);

const { isAuthenticated } = require("../helpers/authenticated");

router.route("/add-category").post(isAuthenticated, addCategory);

module.exports = router;
