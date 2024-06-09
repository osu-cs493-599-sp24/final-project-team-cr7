const { DataTypes } = require('sequelize')
const sequelize = require("../lib/sequelize.js")

const Submission = sequelize.define('Submission', {
    assignmentId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    grade: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    file: {
        type: DataTypes.STRING,
        allowNull: true
    }

})
exports.Submission = Submission

exports.SubmissionClientFields = [
    'assignmentId',
    'studentId',
    'timestamp',
    'grade',
    'file'
]