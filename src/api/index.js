const express = require("express");

const courses = require("./courses");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Detta är API root",
  });
});

router.use("/courses", courses);

module.exports = router;
