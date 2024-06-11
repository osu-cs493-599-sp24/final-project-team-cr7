const { Router } = require('express')
const { Course, CourseStudents } = require('../models/course')
const { User, UserSchema} = require('../models/user')
const { generateAuthToken, requireAuthentication, validateCredentials } = require('../lib/auth')
const router = Router()

/*
 * Returns information about the specified User.
 *
 * If the User has the 'instructor' role, the response should include a list of
 * the IDs of the Courses the User teaches (i.e. Courses whose instructorId field
 * matches the ID of this User).
 *
 * If the User has the 'student' role, the response should include a list of the
 * IDs of the Courses the User is enrolled in. Only an authenticated User whose
 * ID matches the ID of the requested User can fetch this information.
 */
router.get('/userId', requireAuthentication, async function (req, res, next) {
    try {
        const user = await User.findOne({ where: {email: req.user.email}  })
        const authenticated = await validateCredentials(user.id, req.user.password)
        if (!authenticated || user.id != req.user.id) {
            return res.status(403).send({
                error: "The request was not made by an authenticated User satisfying the authorization criteria described above."
            })
        } else if (user.role == 'instructor') {
            const courses = await Course.findAll({ where: {instructorId: user.id} })
            return res.status(200).send({user: user, courses: courses})
        } else if (user.role == 'student') {
            const courses = await CourseStudents.findAll({ where: {studentIds: user.id} })
            return res.status(200).send({user: user, courses: courses})
        } else {
            return res.status(200).send({user: user})
        }
    } catch (err) {
        next(err)
    }
})

/*
 * Create and store a new application User with specified data and adds it to the
 * application's database. Only an authenticated User with 'admin' role can create
 * users with the 'admin' or 'instructor' roles.
 */

router.post('/', requireAuthentication, async function (req, res, next) {
    try {
        const user = await User.findOne({ where: { email: req.user.email } });
        const authenticated = await validateCredentials(user.id, req.user.password);
        if (!authenticated || user.id !== req.user.id) {
            return res.status(403).send({
                error: "The request was not made by an authenticated User satisfying the authorization criteria described above."
            })
        } 
        
        if (user.role === 'admin') {
            if (req.body.role === 'admin' || req.body.role === 'instructor') {
                const newUser = await User.create(req.body, UserSchema)
                return res.status(201).send({ id: newUser.id })
            }
        } else if (user.role === 'instructor') {
            if (req.body.role === 'student') {
                const newUser = await User.create(req.body, UserSchema)
                return res.status(201).send({ id: newUser.id })
            }
        }
        
        return res.status(403).send({
            error: "The request was not made by an authenticated User satisfying the authorization criteria described above."
        })

    } catch (err) {
        next(err)
    }
})

/*
 * Authenticate a specific User with their email address and password.
 */

router.post('/login', async function (req, res, next) {
    try {
        const user = await User.findOne({ where: { email: req.body.email } })
        const authenticated = await validateCredentials(user.id, req.body.password)
        if (!authenticated || user.email !== req.body.email) {
            return res.status(401).send({
                error: "The request was not made by an authenticated User satisfying the authorization criteria described above."
            })
        }

        const token = generateAuthToken(user.id)
        return res.status(200).send({ token: token })
    } catch (err) {
        next(err)
    }
})

module.exports = router