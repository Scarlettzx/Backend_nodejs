const {
    createNoti,
    // getAllComment,
    // getComment,
  } = require("../controller/notification");
  const { checkToken } = require("../auth/token_validation");
  const router = require("express").Router();
// ? NOTI BAND 2 NOTI EMAIL 1
// ! create Noti (post)
router.post('/createnoti',createNoti)
// ! invite by user_id (get params.id) (เอาข้อมูลไปแสดงตรงหน้า notifications ว่า user_id คนนนั้นมี noti อะไรบ้าง)
// ! delete noti ()
// !
  module.exports = router;