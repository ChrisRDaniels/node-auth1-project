const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model");

router.post("/register", (req, res) => {
 let userInformation = req.body;

 // hash password with a time complexity of 12
 const hash = bcrypt.hashSync(userInformation.password, 12);
 userInformation.password = hash;

 Users.add(userInformation)
  .then(saved => {
   res.status(201).json(saved);
   req.session.username = saved.username;
  })
  .catch(error => {
   res.status(500).json(error);
  });
});

// Login User and validate password is correct
router.post("/login", (req, res) => {
 let { username, password } = req.body;

 Users.findBy({ username })
  .first()
  .then(user => {
   if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = user;
    res.status(200).json({ message: `Welcome ${user.username}!` });
   } else {
    res.status(401).json({ message: "Invalid Credentials" });
   }
  })
  .catch(error => {
   res.status(500).json(error);
  });
});

// Logout User and destroy session
router.get("/logout", (req, res) => {
 if (req.session) {
  req.session.destroy();
  res.status(200).json({ message: "Logged out successfully." });
 } else {
  res.status(200).json({ message: "You are already logged out." });
 }
});

module.exports = router;
