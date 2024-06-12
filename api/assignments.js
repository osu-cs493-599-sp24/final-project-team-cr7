const router = require('express').Router();
const {Assignment} = require('../models/assignment')
const {verifyAuthentication} = require('../lib/auth')
const {Submission} = require('../models/submission')

// [INFO] '/' a.k.a the root path is actually '/assignments'

//test check all assignments
router.get('/', async function (req, res){
    // [TODO) Implement this
    const assignments = await Assignment.findAll()
    res.send(200, assignments)
});

/*
 * Create and store a new Assignment with specified data and adds it to the
 * application's database. Only an authenticated User with 'admin' role or an
 * authenticated 'instructor' User whose ID matches the instructorId of the Course
 * corresponding to the Assignment's courseId can create an Assignment.
 */
router.post('/',async function (req, res){
    // [TODO) Implement this
    const assignment = await Assignment.create(req.body)

    res.send(201, {
        id: assignment.id
    });
});

/*
 * Returns summary data about the Assignment, excluding the list of Submissions.
 */
router.get('/:id', async function(req, res){
    // [TODO) Implement this
    const assignment = await Assignment.findByPk(req.params.id)
    res.send(200, assignment)
    
});

/*
 * Performs a partial update on the data for the Assignment. Note that submissions
 * cannot be modified via this endpoint. Only an authenticated User with 'admin'
 * role or an authenticated 'instructor' User whose ID matches the instructorId of
 * the Course corresponding to the Assignment's courseId can update an
 * Assignment.
 */
router.patch('/:id', async (req, res) => {
    // [TODO) Implement this
    const assignment = await Assignment.findByPk(req.params.id)
    assignment.update(req.body)
    //res send the updated message 
    res.send(200, {
        message: 'Assignment updated successfully'
    });
});

/*
 * Completely removes the data for the specified Assignment, including all
 * submissions. Only an authenticated User with 'admin' role or an authenticated
 * 'instructor' User whose ID matches the instructorId of the Course corresponding
 * to the Assignment's courseId can delete an Assignment.
 */
router.delete('/:id', async (req, res) => {
    // [TODO) Implement this
    const result = await Assignment.destroy({where: {id: req.params.id}})
    if (result > 0) {
        res.status(204).send()
      } else {
        next()
      }
    

});

/*
 * Returns the list of all Submissions for an Assignment. This list should be
 * paginated. Only an authenticated User with 'admin' role or an authenticated
 * 'instructor' User whose ID matches the instructorId of the Course corresponding
 * to the Assignment's courseId can fetch the Submissions for an Assignment.
 */
router.get('/:id/submissions', async (req, res,next) => {
    // [TODO) Implement this
    
    try
    {
        const assignment = await Assignment.findByPk(req.params.id)
        const submissions = await Submission.findAll({where: {assignmentId: assignment.id}})
        res.send(200, submissions)

    }
    catch(e)
    {
        next(e)
    }
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
