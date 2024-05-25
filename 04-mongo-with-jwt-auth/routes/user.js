const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { USer, Course, User } = require("../db/index");
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

// User Routes
router.post("/signup", async (req, res) => {
  // Implement user signup logic
  const { username, password } = req.body;

  await User.create({ username, password });

  res.status(201).json({ message: "user created succcessfully" });
});

router.get("/courses", async (req, res) => {
  // Implement listing all courses logic
  const courses = await Course.find({});

  res.json({
    courses,
  });
});

router.post("/signin", async (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.find({
    username,
    password,
  });

  if (user) {
    const token = jwt.sign({ username }, JWT_SECRET);
    res.status(200).json({
      token,
    });
  }
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  const courseID = req.params.courseId;
  const username = req.username;
  await User.updateOne(
    {
      username,
    },
    {
      $push: {
        purchasedCourses: courseID,
      },
    }
  );

  res.json({ message: "Purchase Completed" });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  const user = await User.findOne({
    username: req.username,
  });

  const courses = await Course.find({
    _id: {
      $in: user.purchasedCourses,
    },
  });

  res.json({
    courses,
  });
});

module.exports = router;
