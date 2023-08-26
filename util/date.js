const moment = require("moment");

exports.getCurrentDateTimeFormatted = function () {
  const now = moment();
  return now.format("YYYY-MM-DD HH:mm:ss");
};
