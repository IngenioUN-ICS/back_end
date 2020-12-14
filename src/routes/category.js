const { Router } = require("express");
const router = Router();

const authentication = require("../middlewares/authJwt");
const categoryCtrl = require("../controllers/category.controller");

router.get("/get-all-categories", categoryCtrl.getCategories);

router.post(
  "/add-category",
  [authentication.verifyToken, authentication.isAdmin],
  categoryCtrl.addCategory
);

module.exports = router;
