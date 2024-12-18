const { DataTypes } = require('sequelize')
const sequelize = require("../lib/sequelize.js")

const { User } = require('./user')
const { Assignment } = require('./assignment')

const Submission = sequelize.define('Submission', {
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    },
    grade: {
        type: DataTypes.DECIMAL(6, 3),
        allowNull: true
    },
    file: {
        type: DataTypes.STRING,
        allowNull: true
    },
    downloadlink: {
        type: DataTypes.STRING,
        allowNull: true
    },
    assignmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Assignment,
            key: 'id'
        }
    }

})

Submission.belongsTo(Assignment, {foreignKey: 'assignmentId'})
Assignment.hasMany(Submission, { foreignKey: 'assignmentId'})

Submission.belongsTo(User, {foreignKey: 'studentId' })
User.hasMany(Submission, { foreignKey: 'studentId'})

exports.Submission = Submission

const SubmissionSchema = {
    assignmentId: { required: true },
    studentId: { required: true },
    timestamp: { required: true },
    grade: { required: false },
    file: { required: false }
}
exports.SubmissionSchema = SubmissionSchema