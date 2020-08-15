const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../database/dbConfig");
const secrets = require("../config/secrets");

router.get("/", async (req, res) => {
  const data = await db("users");
  res.status(200).json(data);
});

router.post("/register", async (req, res) => {
  // implement registration
  const userData = req.body;

  try {
    if (userData.username && userData.password) {
      const hash = bcrypt.hashSync(userData.password, 10);
      userData.password = hash;
    } else {
      res.status(400).json({ error: "username and password required" });
    }

    const user = await db("users").insert(userData);
    const returnUser = await db("users").where("id", user[0]).first().select("id", "username");
    res.status(201).json(returnUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "unable to register user" });
  }
});

router.post("/login", async (req, res) => {
  // implement login
  const { username, password } = req.body;
  try {
    const user = await db("users").where({ username }).first();
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      res.status(200).json({ message: `Welcome ${username}`, jwt: token });
    } else {
      res.status(400).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "login error" });
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const secret = secrets.jwtSecret;
  const options = {
    expiresIn: "1h",
  };
  return jwt.sign(payload, secret, options);
}

module.exports = router;
