const { verify } = require("jsonwebtoken");

module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      token = token.slice(7);
      verify(token, "qwe1234", (err, decoded) => {
        if (err) {
          res.status(498).json({
            success: 0,
            message: "Invalid token",
          });
        } else {
          req.decoded = decoded.result;
          // console.log(decoded);
          console.log(decoded.result);
          next();
        }
      });
    } else {
      res.status(401).json({
        success: 0,
        message: "Access denied! unauthorized user",
      });
    }
  },
};
