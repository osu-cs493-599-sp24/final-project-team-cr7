const router = require('express').Router();

const { Course, CourseSchema, CourseStudents } = require('../models/course');
const { User } = require('../models/user');
const { Assignment } = require('../models/assignment');
const { Submission } = require('../models/submission');
const { requireAuthentication } = require('../lib/auth');
const { validateAgainstSchema, extractValidFields } = require('../lib/validation');

// [INFO] '/' a.k.a the root path is actually '/courses'

/*
 * Returns the list of all Courses. This list should be paginated. The Courses
 * returned should not contain the list of students in the Course or the list
 * of Assignments for the Course.
 */
router.get('/', async function (req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1
        const countPerPage = 10
        const subject = req.query.subject || null // Course subjects, i.e. 'cs'
        const number = parseInt(req.query.number) || null; // Course number, i.e. 493
        const term = req.query.term || null // Course term, i.e. sp22

        // Only populate filters if provided in query
        filters = {}
        if (subject) filters.subject = subject
        if (number) filters.number = number
        if (term) filters.term = term

        const courses = await Course.findAndCountAll({
            where: filters,
            limit: countPerPage,
            offset: (page - 1) * countPerPage,
        })
        
        const totalPages = Math.ceil(courses.count / countPerPage);

        if (!courses.rows.length) {
            return res.status(404).send({ error: "No courses found" });
        }
        
        res.status(200).send({
            courses: courses.rows,
            page: page,
            totalPages: totalPages,
            totalCourses: courses.count,
        })
    } catch (err) {
        next(err)
    }
})

/*
 * Creates a new Course with specified data and adds it to the application's
 * database. Only an authenticated User with 'admin' role can create a new Course.
 */
router.post('/', requireAuthentication, async function (req, res, next) {
    const user = await User.findOne({ where: { id: req.user } });
    if (user.role !== 'admin') {
        return res.status(403).send({error: "User does not have permission to create a course"});
    }

    if (!validateAgainstSchema(req.body, CourseSchema)) {
        return res.status(400).send({error: "Request body is not a valid course object"});
    }

    const course = extractValidFields(req.body, CourseSchema);
    const newCourse = await Course.create(course);
    res.status(201).send({
        id: newCourse.id,
    });
});

/*
 * Returns summary data about the Course, excluding the list of students enrolled
 * in the course and the list of Assignments for the course.
 */
router.get('/:id', async function (req, res, next) {
    const courseId = parseInt(req.params.id);
    try {
        const course = await Course.findByPk(courseId);
        if (course) {
            res.status(200).send(course);
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
});

/*
 * Performs a partial update on the data for the Course. Note that enrolled
 * students and assignments cannot be modified via this endpoint. Only an
 * authenticated User with 'admin' role or an authenticated 'instructor' User
 * whose ID matches the instructorId of the Course can update Course information.
 */
router.patch('/:id', requireAuthentication, async function (req, res, next) {
    const courseId = parseInt(req.params.id);
    try {
        if (!validateAgainstSchema(req.body, CourseSchema)) {
            return res.status(400).send({error: "Request body is not a valid course object"});
        }

        const user = await User.findByPk(req.user)
        const course = await Course.findByPk(courseId);
        if (user.role !== 'admin' && req.user !== course.instructorId) {
            return res.status(403).send({error: "User does not have permission to update course"});
        }

        const userCourse = extractValidFields(req.body, CourseSchema);
        const result = await Course.update(userCourse, {
            where: { id: courseId },
            fields: CourseSchema.keys,
        });

        if (result[0] > 0) {
            return res.status(200).send();
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
});

/*
 * Completely removes the data for the specified Course, including all enrolled
 * students, all Assignments, etc. Only an authenticated User with 'admin' role
 * can remove a Course.
 */
router.delete('/:id', requireAuthentication, async function (req, res, next) {
    const courseId = parseInt(req.params.id);
    try {
        const user = await User.findByPk(req.user)
        const course = await Course.findByPk(courseId);
        if (user.role !== 'admin' && req.user !== course.instructorId) {
            return res.status(403).send({error: "User does not have permission to delete course"});
        }

        const result = await Course.destroy({ where: { id: courseId } });

        if (result > 0) {
            return res.status(204).send();
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
});

/*
 * Returns a list containing the User IDs of all students currently enrolled in
 * the Course. Only an authenticated User with 'admin' role or an authenticated
 * 'instructor' User whose ID matches the instructorId of the Course can fetch
 * the list of enrolled students.
 */
router.get('/:id/students', async (req, res, next) => {
    const courseId = parseInt(req.params.id);
    try {
        const user = await User.findByPk(req.user);
        const course = await Course.findByPk(courseId);
        if (user.role !== 'admin' && req.user !== course.instructorId) {
            return res.status(403).send({error: "User does not have permission to view students"});
        }

        const result = await CourseStudents.findAll({ where: { courseId: courseId } });
        // Iterate thru each student in the course and get their info
        const studentList = [];
        for await (student of result) {
            const studentResult = await User.findByPk(student.studentId);
            const studentValues = studentResult.dataValues;
            delete studentValues.password;
            studentList.push(studentValues);
        }

        return res.status(200).send({
            students: studentList,
        });
    } catch (err) {
        next(err)
    }
});

/*
 * Enrolls and/or unenrolls students from a Course. Only an authenticated User
 * with 'admin' role or an authenticated 'instructor' User whose ID matches the
 * instructorId of the Course can update the students enrolled in the Course.
 */
router.post('/:id/students', async (req, res, next) => {
    // [TODO) Implement this
    const courseId = parseInt(req.params.id);
    const add = req.body.add;
    const remove = req.body.remove;
    try {
        const user = await User.findByPk(req.user);
        const course = await Course.findByPk(courseId);
        if (user.role !== 'admin' && req.user !== course.instructorId) {
            return res.status(403).send({error: "User does not have permission to update students"});
        }

        for await (stu of add) {
            const result = await CourseStudents.create({
                courseId: courseId,
                studentId: stu,
            })
        }

        for await (stu of remove) {
            const result = await CourseStudents.destroy({
                where: {
                    courseId: courseId,
                    studentId: stu,
                },
            })
        }
        return res.status(200).send()
    } catch (err) {
        next(err)
    }
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

module.exports = router;