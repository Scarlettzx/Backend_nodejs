const {
  create,
  getUserByuserId,
  getUsers,
  updateUser,
  deleteUser,
  getUserByUserEmail,
  getUserByuserName,
} = require("./user.service");

const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    getUserByUserEmail(body.email, (err, results) => {
      if (!results) {
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        create(body, (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: 0,
              message: "Database connection error",
            });
          }
          return res.status(200).json({
            success: 1,
            data: body,
          });
        });
      } else {
        return res.json({
          success: 0,
          data: "email is already",
        });
      }
    });
  },
  getUserByuserId: (req, res) => {
    const id = req.params.id;
    getUserByuserId(id, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.status(404).json({
          success: 0,
          message: "Record not Found",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },

  getUserByuserName: (req, res) => {
    const username = req.params.username;
    getUserByuserName(username, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.status(404).json({
          success: 0,
          message: "Record not Found",
        });
      }
      const sanitizedResults = results.map((results) => {
        const { user_password, ...sanitizedResult } = results;
        return sanitizedResult;
      });
      return res.status(200).json({
        success: 1,
        data: sanitizedResults,
      });
    });
  },
  getUsers: (req, res) => {
    getUsers((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  updateUsers: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    updateUser(body, (err, results) => {
      if (err) {
        console.log(err);
        return false;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Failed to Update user",
        });
      }
      return res.status(200).json({
        success: 1,
        data: "updated successfully",
      });
    });
  },
  deleteUser: (req, res) => {
    const data = req.body;
    deleteUser(data, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record Not Found",
        });
      }
      return res.status(200).json({
        success: 1,
        data: "updated successfully",
      });
    });
  },
  login: (req, res) => {
    const body = req.body;
    getUserByUserEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }
      const result = compareSync(body.password, results.password);
      if (result) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, "qwe1234", {
          expiresIn: "1h",
        });
        return res.json({
          success: 1,
          data: "updated successfully",
          token: jsontoken,
        });
      } else {
        return res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }
    });
  },
};
