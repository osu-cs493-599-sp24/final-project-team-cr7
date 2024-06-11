require('dotenv').config()
const sequelize = require('./lib/sequelize')

const { Assignment, AssignmentSchema } = require('./models/assignment')
const { Course, CourseSchema } = require('./models/course')
const { Submission, SubmissionSchema } = require('./models/submission')
const { User, UserSchema } = require('./models/user')

const assignmentData = require('./data/assignments.json')
const courseData = require('./data/courses.json')
const submissionData = require('./data/submissions.json')
const userData = require('./data/users.json')


sequelize.sync().then(async function () {
    await User.bulkCreate(userData, { fields: UserSchema.keys })
    await Course.bulkCreate(courseData, { fields: CourseSchema.keys })
    await Assignment.bulkCreate(assignmentData, { fields: AssignmentSchema.keys })
    await Submission.bulkCreate(submissionData, { fields: SubmissionSchema.keys })
    console.log('Database populated')
})