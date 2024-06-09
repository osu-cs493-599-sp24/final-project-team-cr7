const { DataTypes } = require('sequelize')
const sequelize = require("../lib/sequelize.js")

const Submission = sequelize.define('Submission', {
    assignmentId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    studentId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    },
    grade: {
        type: DataTypes.FLOAT,
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