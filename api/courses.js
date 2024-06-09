const { Router } = require('express');
const { ValidationError } = require('sequelize');
const { Course, CourseClientFields } = require('../model/course');
const router = Router();

router.get('/courses', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Define the number of courses per page
    const offset = (page - 1) * limit;

    const filters = {};
    if (req.query.subject) {
      filters.subject = req.query.subject;
    }
    if (req.query.number) {
      filters.number = req.query.number;
    }
    if (req.query.term) {
      filters.term = req.query.term;
    }

    const courses = await Course.findAndCountAll({
      where: filters,
      limit,
      offset,
      attributes: { exclude: ['students', 'assignments'] } // Exclude students and assignments
    });

    res.status(200).json({
      courses: courses.rows,
      totalPages: Math.ceil(courses.count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching courses." });
  }
});

module.exports = router;
