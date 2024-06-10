const router = require('express').Router();

// [INFO] '/' a.k.a the root path is actually '/submissions'

/*
 * Performs a partial update on the data for the Submission. This is the only way
 * to assign a grade to a Submission. Only an authenticated User with 'admin' role
 * or an authenticated 'instructor' User whose ID matches the instructorId of the
 * associated course can update a Submission.
 */
router.patch('/:id', (req, res) => {
    // [TODO) Implement this
    res.send(200);
});

/*
 * Download a Submission's associated file. Only an authenticated User with
 * 'admin' role or an authenticated 'instructor' User whose ID matches the
 * instructorId of the associated course can update a Submission.
 */
router.get('/media/submissions/:filename', (req, res) => {
    // [TODO) Implement this
    res.send(200);
});

module.exports = router;
