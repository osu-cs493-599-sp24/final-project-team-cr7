const { DataTypes } = require('sequelize')
const sequelize = require("../lib/sequelize.js")

const Course = sequelize.define('Course', {
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    number: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.STRING,
        allowNull: false
    }
})
exports.Course = Course

exports.CourseClientFields = [
    'subject',
    'number',
    'title',
    'term',
    'instructorId'
]