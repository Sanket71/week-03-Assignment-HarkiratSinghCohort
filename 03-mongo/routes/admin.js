const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db/index");
const router = Router();

// Admin Routes
router.post("/signin", async function (req, res) {
  const { username, password } = req.body;

  await Admin.create({
    username,
    password,
  });

  res.json({
    msg: "Admin created successfully",
    username,
    password,
  });
});

router.post("/courses", adminMiddleware, async function (req, res) {
  const { title, descripton, imageLink, price } = req.body;

  const newCourse = await Course.create({
    title,
    descripton,
    imageLink,
    price,
  });

  res.json({
    msg: "Course created successfully",
    courseId: newCourse._id,
  });
});

router.get("/courses", adminMiddleware, async (req, res) => {
  // Implement fetching all courses logic
  const courses = await Course.find({});

  res.json({ courses });
});

module.exports = router;
