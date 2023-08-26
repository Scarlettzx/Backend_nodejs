const {
  createUser,
  deleteUser,
  getUserByuserId,
  getUsers,
  getUserByuserName,
  updateUsers,
  login,
} = require("./user.controller.js");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

router.post("/", createUser);
router.get("/", getUsers);
// router.get("/:id", getUserByuserId);
router.get("/:username", getUserByuserName);
router.patch("/", checkToken, updateUsers);
router.delete("/", checkToken, deleteUser);
// router.post("/register", createUser);
router.post("/login", login);

module.exports = router;
