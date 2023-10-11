const {
    createNoti,
    // getAllComments,
    // getComment,
  } = require("../service/comment");
  const { getUserByuserId } = require("../service/user");
  const myDateModule = require("../util/date");
  module.exports = {
    createNoti: (req,  res)=>{
        const body = req.body;
        const createAt = myDateModule.getCurrentDateTimeFormatted();
        createNoti(body,createAt,(err, result)=>{
            
        });
    }
  }