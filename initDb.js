require('dotenv').config();
const sequelize = require('./lib/sequelize');

const { Assignment, AssignmentSchema } = require('./models/assignment');
const { Course, CourseSchema, CourseStudents } = require('./models/course');
const { Submission, SubmissionSchema } = require('./models/submission');
const { User, UserSchema } = require('./models/user');

const assignmentData = require('./data/assignments.json');
const courseData = require('./data/courses.json');
const submissionData = require('./data/submissions.json');
const userData = require('./data/users.json');
const courseStudentData = require('./data/coursestudents.json');

sequelize.sync().then(async function () {
    if (!await User.count()) {
        await User.bulkCreate(userData, { fields: UserSchema.keys });
    }

    if (!await Course.count()) {
        await Course.bulkCreate(courseData, { fields: CourseSchema.keys });
    }

    if (!await Assignment.count()) {
        await Assignment.bulkCreate(assignmentData, { fields: AssignmentSchema.keys });
    }

    if (!await Submission.count()) {
        await Submission.bulkCreate(submissionData, { fields: SubmissionSchema.keys });
    }

    if (!await CourseStudents.count()) {
        await CourseStudents.bulkCreate(courseStudentData);
    }
    console.log('=== Database populated');
});

