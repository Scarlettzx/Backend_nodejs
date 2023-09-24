const { createRole, getRole } = require("../service/role");
module.exports = {
  createRoles: (req, res) => {
    const body = req.body;
    createRole(body.name, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          sucess: 0,
          message: "Database connection error",
        });
      }
      return res.status(200).json({
        sucess: 1,
        data: results,
      });
    });
  },
  getRoles: (req, res) => {
    getRole((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.status(200).json({
        sucess: 1,
        data: results,
      });
    });
  },
};
