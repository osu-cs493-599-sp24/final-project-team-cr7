const { DataTypes } = require('sequelize')
const sequelize = require("../lib/sequelize.js")

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

const CourseSchema = {
    subject: { required: true },
    number: { required: true },
    title: { required: true },
    term: { required: true },
    instructorId: { required: true }
}
exports.CourseSchema = CourseSchema