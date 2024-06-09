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

// Setup relationship between Course and User for instructorID
Course.hasOne(User, { foreignKey: 'id', sourceKey: 'instructorId' })
User.hasMany(Course, { foreignKey: 'instructorId', sourceKey: 'id' })

exports.Course = Course

const CourseSchema = {
    subject: { required: true },
    number: { required: true },
    title: { required: true },
    term: { required: true },
    instructorId: { required: true }
}
exports.CourseSchema = CourseSchema