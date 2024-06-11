const { DataTypes } = require('sequelize')
const sequelize = require("../lib/sequelize.js")

const { User } = require('./user')

const Course = sequelize.define('Course', {
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    term : {
        type: DataTypes.STRING,
        allowNull: false
    },
    instructorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})
exports.Course = Course

const CourseStudents = sequelize.define('CourseStudents', {
    courseId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    studentId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
})
exports.CourseStudents = CourseStudents

// Setup relationship between Course and User for studentID
Course.belongsToMany(User, { through: CourseStudents, foreignKey: 'courseId' });
User.belongsToMany(Course, { through: CourseStudents, foreignKey: 'studentId' });

const CourseSchema = {
    subject: { required: true },
    number: { required: true },
    title: { required: true },
    term: { required: true },
    instructorId: { required: true }
}
exports.CourseSchema = CourseSchema