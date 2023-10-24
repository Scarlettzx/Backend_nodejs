const {
  createNotiByuser,
  createNotiByband,
  checkInviteBandbyband,
  checkInviteBandbyuser,
  deletenotiInvitebandbyuser,
  deletenotiInvitebandbyband,
  getNotifications,
  sendOfferuser,
  sendOfferband,
  checksendemailtoUser,
  checksendemailtoBand,
} = require("../controller/notification");
const { checkToken } = require("../auth/token_validation");
const router = require("express").Router();
// // ? NOTI BAND 2 NOTI EMAIL 1
// // ! create Noti (post)
router.get("/getnotifications", checkToken, getNotifications);
router.post("/invitebandbyuser", checkToken, createNotiByuser);
router.post("/invitebandbyband", checkToken, createNotiByband);
router.post("/sendofferuser", checkToken, sendOfferuser);
router.post("/sendofferband", checkToken, sendOfferband);
router.post("/checkinvitedbyband", checkToken, checkInviteBandbyband);
router.post("/checkinvitedbyuser", checkToken, checkInviteBandbyuser);
router.post("/checksendemailtouser", checkToken, checksendemailtoUser);
router.post("/checksendemailtoband", checkToken, checksendemailtoBand);
router.delete(
  "/deleteinvitedbandbyuser",
  checkToken,
  deletenotiInvitebandbyuser
);
router.delete(
  "/deleteinvitedbandbyband",
  checkToken,
  deletenotiInvitebandbyband
);

// // ! invite by user_id (get params.id) (เอาข้อมูลไปแสดงตรงหน้า notifications ว่า user_id คนนนั้นมี noti อะไรบ้าง)
// // ! delete noti ()
// // !
module.exports = router;
