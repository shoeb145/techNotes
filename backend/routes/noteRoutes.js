const express = require("express");
const router = express.Router();
const app = express();
const controllers = require("../controllers/notecontroller");

router
  .route("/")

  .get(controllers.getAllNotes)
  .post(controllers.createNote)
  .patch(controllers.updateNote)
  .delete(controllers.deleteNote);

module.exports = router;
