const router = require("express").Router();

const Users = require("../users/users-model");
const authRequired = require("../middleware/auth-required");

//Get a list of registered users only if logged in
router.get("/", authRequired, (req, res) => {
 Users.find()
  .then(users => {
   res.json(users);
  })
  .catch(err => res.send(err));
});

module.exports = router;
