const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
  uploadAnalysis,
  saveAnalysis,
} = require("../controllers/analysisController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/upload",
  upload.array("videos", 5),
  uploadAnalysis
);
router.post("/save", saveAnalysis);

module.exports = router;