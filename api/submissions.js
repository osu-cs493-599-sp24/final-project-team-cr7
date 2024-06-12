const router = require('express').Router();
const {User} = require('../models/user')
const {Course} = require('../models/course')
const {requireAuthentication} = require('../lib/auth')
const {Submission} = require('../models/submission')
const {Assignment} = require('../models/assignment')


// [INFO] '/' a.k.a the root path is actually '/submissions'

/*
 * Performs a partial update on the data for the Submission. This is the only way
 * to assign a grade to a Submission. Only an authenticated User with 'admin' role
 * or an authenticated 'instructor' User whose ID matches the instructorId of the
 * associated course can update a Submission.
 */

//only grading and change the student id of submission
router.patch('/:id', requireAuthentication,async (req, res,next) => {
    // [TODO) Implement this
    try{
        const user = await User.findByPk(req.user)
        const assignment = await Assignment.findByPk(req.body.assignmentId)
        const course = await Course.findByPk(assignment.courseId)
        if(user.role === 'admin' || user.id === course.instructorId)
        {   
            const student = await User.findByPk(req.body.studentId)
            if(student.role === 'student')
                {
                    //only update the grade
                    const submission = await Submission.findByPk(req.params.id)
                    if(submission)
                        {
                            submission.grade = req.body.grade
                            submission.studentId = req.body.studentId
                            await submission.save()
                            //send the updated grade message
                            res.send(200, {message: 'Grade updated'})
                        }
                        else{
                            return res.status(404).send({error: 'Submission not found'})
                        }
                    
                    
                }
                else{
                    return res.status(403).send({error: 'ID is not a student ID'})
                }
            
        }
        else{
            return res.status(403).send({error: 'Not authorized to access the specified resource'})
        }
    }catch(e)
    {
        next(e)
    }
});

/*
 * Download a Submission's associated file. Only an authenticated User with
 * 'admin' role or an authenticated 'instructor' User whose ID matches the
 * instructorId of the associated course can update a Submission.
 */
// router.get('/media/submissions/:filename', (req, res) => {
//     // [TODO) Implement this
//     res.send(200);
// });

module.exports = router;
