const router = require('express').Router();

const { Course, CourseSchema } = require('../models/course');

// [INFO] '/' a.k.a the root path is actually '/courses'


// [[TODO]] Add pagination here
/*
 * Returns the list of all Courses. This list should be paginated. The Courses
 * returned should not contain the list of students in the Course or the list
 * of Assignments for the Course.
 */
router.get('/', async function (req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const countPerPage = 10
    const subject = req.query.subject || null; // Course subjects, i.e. 'cs'
    const number = parseInt(req.query.number) || null; // Course number, i.e. 493
    const term = req.query.term || null; // Course term, i.e. sp22

    // Only populate filters if provided in query
    filters = {}
    if (subject) filters.subject = subject
    if (number) filters.number = number
    if (term) filters.term = term

    const courses = await Course.findAndCountAll({
        where: filters,
        limit: countPerPage,
        offset: (page - 1) * countPerPage,
    });
    
    if (!courses.rows.length) {
        return res.send(404, {error: "No courses found"})
    }
    res.status(200).send({
        courses: courses.rows,
    });
});

/*
 * Creates a new Course with specified data and adds it to the application's
 * database. Only an authenticated User with 'admin' role can create a new Course.
 */
router.post('/', (req, res) => {
    // [TODO) Implement this
    const subject = req.body.subject;
    const number = req.body.number;
    const title = req.body.title;
    const term = req.body.term;
    const instructorId = req.body.instructorId;
    res.send(201, {
        subject: subject,
        number: number,
        title: title,
        term: term,
        instructorId: instructorId,
    });
});

/*
 * Returns summary data about the Course, excluding the list of students enrolled
 * in the course and the list of Assignments for the course.
 */
router.get('/:id', (req, res) => {
    // const courseId = req.params.id;
    res.send(200, {
        subject: 'CS',
        number: '493',
        title: 'Cloud Application Development',
        term: 'sp22',
        instructorId: 123,
    });
});

/*
 * Performs a partial update on the data for the Course. Note that enrolled
 * students and assignments cannot be modified via this endpoint. Only an
 * authenticated User with 'admin' role or an authenticated 'instructor' User
 * whose ID matches the instructorId of the Course can update Course information.
 */
router.patch('/:id', (req, res) => {
    // [TODO) Implement this
    //const courseId = req.params.id;
    const subject = req.body.subject;
    const number = req.body.number;
    const title = req.body.title;
    const term = req.body.term;
    const instructorId = req.body.instructorId;
    res.send(200, {
        subject: subject,
        number: number,
        title: title,
        term: term,
        instructorId: instructorId,
    });
});

/*
 * Completely removes the data for the specified Course, including all enrolled
 * students, all Assignments, etc. Only an authenticated User with 'admin' role
 * can remove a Course.
 */
router.delete('/:id', (req, res) => {
    // [TODO) Implement this
    //const courseId = req.params.id;
    res.send(204);
});

/*
 * Returns a list containing the User IDs of all students currently enrolled in
 * the Course. Only an authenticated User with 'admin' role or an authenticated
 * 'instructor' User whose ID matches the instructorId of the Course can fetch
 * the list of enrolled students.
 */
router.get('/:id/students', (req, res) => {
    // [TODO) Implement this
    //const courseId = req.params.id;
    res.send(200, {
        students: [123, 456],
    });
});

/*
 * Enrolls and/or unenrolls students from a Course. Only an authenticated User
 * with 'admin' role or an authenticated 'instructor' User whose ID matches the
 * instructorId of the Course can update the students enrolled in the Course.
 */
router.post('/:id/students', (req, res) => {
    // [TODO) Implement this
    //const courseId = req.params.id;
    const studentId = req.body.studentId;
    res.send(201, {
        studentId: studentId,
    });
});

/*
 * Returns a CSV file containing information about all of the students currently
 * enrolled in the Course, including names, IDs, and email addresses. Only an
 * authenticated User with 'admin' role or an authenticated 'instructor' User
 * whose ID matches the instructorId of the Course can fetch the course roster.
 */
router.get('/:id/roster', (req, res) => {
    // [TODO) Implement this
    //const courseId = req.params.id;
    res.send(200, {
        message: 'CSV file',
    });
});

/*
 * Returns a list containing the Assignment IDs of all Assignments for the Course.
 */
router.get('/:id/assignments', (req, res) => {
    // [TODO) Implement this
    //const courseId = req.params.id;
    res.send(200, {
        assignments: [
            {
                courseId: 123,
                title: 'Assignment 3',
                points: 100,
                due: '2022-06-14T17:00:00-07:00',
            },
        ],
    });
});

//const { Router } = require('express');
//const { ValidationError } = require('sequelize');
//const { Course, CourseClientFields } = require('../model/course');
//const router = Router();

/*router.get('/courses', async (req, res, next) => {
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
      attributes: { exclude: ['createdAt', 'updatedAt', 'students', 'assignments'] } // Exclude students and assignments
    });

    res.status(200).json({
      courses: courses.rows,
      totalPages: Math.ceil(courses.count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err);
    next(err); // Pass the error to the next middleware
  }
});
*/
module.exports = router;