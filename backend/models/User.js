const mongoose = require("mongoose");
const AutoIncrementFactor = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: String,
      default: "Employee",
    },
  ],

  active: {
    type: Boolean,
    default: true,
  },
});
userSchema.plugin(AutoIncrementFactor, {
  inc_field: "ticket",
  id: "ticketNums",
  start_seq: 500,
});
module.exports = mongoose.model("User", userSchema);
