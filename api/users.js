const { Router } = require('express')
const { Course, CourseStudents } = require('../models/course')
const { User, UserSchema, validateCredentials} = require('../models/user')
const { generateAuthToken, requireAuthentication } = require('../lib/auth')
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
router.get('/:id', requireAuthentication, async function (req, res, next) {
    try {
        if (req.user !== parseInt(req.params.id)) {
            return res.status(403).send({
                error: "Not authorized to access the specified resource"
            })
        }
        const user = await User.findByPk(req.user)
        if (user.role == 'instructor') {
            const courses = await Course.findAll({ where: {instructorId: user.id} })
            return res.status(200).send({user: user, courses: courses})
        } else if (user.role == 'student') {
            const courses = await CourseStudents.findAll({ where: {studentId: user.id} })
            return res.status(200).send({user: user, courses: courses})
        } else {
            return res.status(403).send({
                error: "The user does not have the necessary permissions to access the specified resource."
            })
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
        const user = await User.findByPk(req.user)
        if (user.role === 'admin') {
            const newUser = await User.create(req.body, UserSchema)
            return res.status(201).send({ id: newUser.id })
        } else if (user.role === 'instructor') {
            if (req.body.role === 'student') {
                const newUser = await User.create(req.body, UserSchema)
                return res.status(201).send({ id: newUser.id })
            } else {
                return res.status(403).send({
                    error: "Only users with 'admin' role can create users with 'instructor' role."
                })
            }
        } else {
            return res.status(403).send({
                error: "The user does not have the necessary permissions to create users."
            })
        }
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
        if (!user) { 
            return res.status(400).send({ error: "The request body was either not present or did not contain all of the required fields." }) 
        }
        const authenticated = await validateCredentials(user.id, req.body.password)
        if (!authenticated) {
            return res.status(401).send({ error: "The specified credentials were invalid." })
        }
        const token = generateAuthToken(user.id)
        return res.status(200).send({ token: token })
    } catch (err) {
        next(err)
    }
})

module.exports = router