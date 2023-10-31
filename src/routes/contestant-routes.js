const express = require("express");
const contestantController = require("../controllers/contestant-controller");
const authController = require("../controllers/auth-controller");
const userController = require("../controllers/user-controller");

const router = express.Router();

// router.patch("/vote/:id", contestantController.vote);

router
  .route("/")
  .get(contestantController.getAllContestants)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    contestantController.uploadUserPhoto,
    contestantController.resizeUserPhoto,
    contestantController.createContestant
  );

router
  .route("/:id")
  .get(contestantController.getContestant)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    contestantController.updateContestant
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    contestantController.deleteContestant
  );

module.exports = router;
