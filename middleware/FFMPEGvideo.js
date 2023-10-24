const fs = require("fs");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
function resizeVideo(videoPath, callback) {
  const outputVideoPath = videoPath.replace(".mp4", "_resized.mp4");
  ffmpeg(videoPath)
    .size("720x1280")
    .videoCodec("libx264")
    .inputOptions(["-threads 4"]) // ตั้งค่าจำนวนเทรดให้ ffmpeg
    // .videoBitrate("1000k") // ตั้งค่า bitrate ให้ต่ำลง, ตัวอย่างเช่น 1000k
    // .fps(29.4)
    .on("end", function () {
      console.log(videoPath);
      console.log("วิดีโอถูกประมวลผลแล้ว");
      callback(null);
    })
    .on("progress", function (progress) {
      console.log("...frames" + progress.frames);
    })
    .on("error", function (err) {
      console.log("เกิดข้อผิดพลาดในการประมวลผลวิดีโอ:", err);
      callback(err);
    })
    .save(outputVideoPath);
}

module.exports = resizeVideo;
