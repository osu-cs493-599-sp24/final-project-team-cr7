const router = require('express').Router();

// [INFO] '/' a.k.a the root path is actually '/assignments'

/*
 * Create and store a new Assignment with specified data and adds it to the
 * application's database. Only an authenticated User with 'admin' role or an
 * authenticated 'instructor' User whose ID matches the instructorId of the Course
 * corresponding to the Assignment's courseId can create an Assignment.
 */
router.post('/', (req, res) => {
    // [TODO) Implement this
    res.send(201, {
        courseId: 123,
        title: 'Assignment 3',
        points: 100,
        due: '2022-06-14T17:00:00-07:00',
    });
});

/*
 * Returns summary data about the Assignment, excluding the list of Submissions.
 */
router.get('/:id', (req, res) => {
    // [TODO) Implement this
    res.send(200, {
        courseId: 123,
        title: 'Assignment 3',
        points: 100,
        due: '2022-06-14T17:00:00-07:00',
    });
});

/*
 * Performs a partial update on the data for the Assignment. Note that submissions
 * cannot be modified via this endpoint. Only an authenticated User with 'admin'
 * role or an authenticated 'instructor' User whose ID matches the instructorId of
 * the Course corresponding to the Assignment's courseId can update an
 * Assignment.
 */
router.patch('/:id', (req, res) => {
    // [TODO) Implement this
    res.send(200, {
        courseId: 123,
        title: 'Assignment 3',
        points: 100,
        due: '2022-06-14T17:00:00-07:00',
    });
});

/*
 * Completely removes the data for the specified Assignment, including all
 * submissions. Only an authenticated User with 'admin' role or an authenticated
 * 'instructor' User whose ID matches the instructorId of the Course corresponding
 * to the Assignment's courseId can delete an Assignment.
 */
router.delete('/:id', (req, res) => {
    // [TODO) Implement this
    res.send(204);
});

/*
 * Returns the list of all Submissions for an Assignment. This list should be
 * paginated. Only an authenticated User with 'admin' role or an authenticated
 * 'instructor' User whose ID matches the instructorId of the Course corresponding
 * to the Assignment's courseId can fetch the Submissions for an Assignment.
 */
router.get('/:id/submissions', (req, res) => {
    // [TODO) Implement this
    res.send(200, {
        submissions: [
            {
                assignmentId: 123,
                studentId: 123,
                timestamp: '2022-06-14T17:00:00-07:00',
                grade: 94.5,
                file: 'string',
            },
        ],
    });
});

/*
 * Create and store a new Assignment with specified data and adds it to the
 * application's database. Only an authenticated User with 'student' role who is
 * enrolled in the Course corresponding to the Assignment's courseId can create a
 * Submission.
 */
router.post('/:id/submissions', (req, res) => {
    // [TODO) Implement this
    res.send(201, {
        id: 123,
    });
});

module.exports = router;
