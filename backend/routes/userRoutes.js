const express = require("express");
const app = express();
const router = express.Router();
const controllers = require("../controllers/usercontroller");

router
  .route("/")

  .get(controllers.getAllUsers)
  .post(controllers.createUsers)
  .patch(controllers.updateUsers)
  .delete(controllers.deleteUsers);

module.exports = router;
