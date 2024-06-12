const router = require('express').Router();
const {Assignment} = require('../models/assignment')
const {requireAuthentication} = require('../lib/auth')
const {Submission} = require('../models/submission')
const {User} = require('../models/user')
const {Course} = require('../models/course')

const {upload} = require('../lib/upload')

// [INFO] '/' a.k.a the root path is actually '/assignments'

//test check all assignments
router.get('/', requireAuthentication,async function (req, res){
    // [TODO) Implement this
    const user = await User.findByPk(req.user)
    //allow student to see all assignments
    try{
        if(user.role === 'student')
            {
                const assignments = await Assignment.findAll()
                res.send(200, assignments)
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
 * Create and store a new Assignment with specified data and adds it to the
 * application's database. Only an authenticated User with 'admin' role or an
 * authenticated 'instructor' User whose ID matches the instructorId of the Course
 * corresponding to the Assignment's courseId can create an Assignment.
 */
router.post('/',requireAuthentication,async function (req, res){
    // [TODO) Implement this
    try{
        const user = await User.findByPk(req.user)
        //get array of courses the database has
        
        if(user.role === 'admin' || user.role === 'instructor')
        {
            //check if the course exists in the database
            
            const assignment = await Assignment.create(req.body)
            res.send(201, {
                id: assignment.id
            });
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
router.patch('/:id', requireAuthentication,async (req, res,next) => {
    // [TODO) Implement this
    const user = await User.findByPk(req.user)

    try{
        if(user.role === 'admin' || user.role === 'instructor')
            {
        const course = await Course.findByPk(req.body.courseId)
        if(!course){
            return res.status(404).send({error: 'Course not found'})
        }
        const assignment = await Assignment.findByPk(req.params.id)
        if(!assignment)
            {
               return res.status(404).send({error: 'Assignment not found'})
            }

        assignment.update(req.body)
        //res send the updated message 
        res.send(200, {
            message: 'Assignment updated successfully'
        })
    }
    else{
        return res.status(403).send({error: 'Not authorized to access the specified resource'})
    
    }
    }catch(e){
        next(e)
    }

    
});

/*
 * Completely removes the data for the specified Assignment, including all
 * submissions. Only an authenticated User with 'admin' role or an authenticated
 * 'instructor' User whose ID matches the instructorId of the Course corresponding
 * to the Assignment's courseId can delete an Assignment.
 */
router.delete('/:id', requireAuthentication,async (req, res, next) => {
    // [TODO) Implement this
    try{
        const user = await User.findByPk(req.user)

        if(user.role === 'admin' || user.role === 'instructor')
            {
                const result = await Assignment.destroy({where: {id: req.params.id}})
                if (result > 0) {
                    res.status(204).send(
                        {message: 'Assignment deleted successfully'}
                    )
                  } else {
                    next()
                  }
            }
            else{
                return res.status(403).send({error: 'Not authorized to access the specified resource'})
            }
    }
    catch(e)
    {
        next(e)
    }
    
    

});

/*
 * Returns the list of all Submissions for an Assignment. This list should be
 * paginated. Only an authenticated User with 'admin' role or an authenticated
 * 'instructor' User whose ID matches the instructorId of the Course corresponding
 * to the Assignment's courseId can fetch the Submissions for an Assignment.
 */
router.get('/:id/submissions', requireAuthentication, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user);
        
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        if (user.role === 'admin' || user.role === 'instructor') {
            const assignment = await Assignment.findByPk(req.params.id);

            if (!assignment) {
                return res.status(404).send({ error: 'Assignment not found' });
            }

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 3;
            const offset = (page - 1) * limit;

            const submissions = await Submission.findAndCountAll({
                where: { id: assignment.id },
                limit,
                offset
            });

            const totalPages = Math.ceil(submissions.count / limit);

            res.status(200).send({
                submissions: submissions.rows,
                currentPage: page,
                totalPages,
                totalSubmissions: submissions.count
            });
        } else {
            return res.status(403).send({ error: 'Not authorized to access the specified resource' });
        }
    } catch (e) {
        next(e);
    }
});

/*
 * Create and store a new Assignment with specified data and adds it to the
 * application's database. Only an authenticated User with 'student' role who is
 * enrolled in the Course corresponding to the Assignment's courseId can create a
 * Submission.
 */
router.post('/:id/submissions',requireAuthentication ,upload.single('file'), async (req, res,next) => {
    // [TODO) Implement this
    // const sub= Submission.create(req.body)
    //check if user is student and if the student is enrolled in the course

    //check if the assignment exists in the course

    try{
        const user = await User.findByPk(req.user)
        if(user.role ==='student')
            {
                const assignment = await Assignment.findByPk(req.params.id)
                if(!assignment)
                    {
                        res.status(404).send({error: 'Assignment not found'})
                    }
                    else
                    {
                        console.log(req.body)
                        console.log(req.file)
                        const sub = await Submission.create({
                            ...req.body,
                            file: req.file.filename,
                            downloadlink: `/media/uploads/${req.file.filename}`,
                            assignmentId: req.params.id
                        })
                        res.send(201, {
                            id: sub.id
                        });
                    }
            }
            else
            {
                return res.status(403).send({error: 'You are not a student'})
            }
       
        
    }catch(e)
    {
        next(e)
    }

    
});



module.exports = router;
