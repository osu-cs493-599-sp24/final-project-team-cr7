const router = require('express').Router();

// [INFO] '/' a.k.a the root path is actually '/courses'

/*
 * Returns the list of all Courses. This list should be paginated. The Courses
 * returned should not contain the list of students in the Course or the list
 * of Assignments for the Course.
 */
router.get('/', (req, res) => {
    //const page = req.query.page || 0;
    //const subjects = req.query.subjects || ''; // Course subjects, i.e. 'cs'
    //const number = req.query.number || ''; // Course number, i.e. 493
    //const term = req.query.term || ''; // Course term, i.e. sp22
    res.send(200, {
        courses: [
            {
                subject: 'CS',
                number: '493',
                title: 'Cloud Application Development',
                term: 'sp22',
                instructorId: 123,
            },
        ],
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
module.exports = router;
