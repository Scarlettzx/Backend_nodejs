const { createRoles, getRoles } = require("../controller/role.js");
const router = require("express").Router();
router.get("/", getRoles);
router.post("/", createRoles);
module.exports = router;