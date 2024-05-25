const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db/index");

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

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  const courseID = req.params.courseId;
  const username = req.headers.username;

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

  res.json({ message: "Purchased Completed" });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  const user = await User.findOne({
    username: req.headers.username,
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
