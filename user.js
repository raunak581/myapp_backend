const { DataTypes } = require('sequelize');
const { sequelize } = require('./database/login'); // Ensure this path is correct

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true, // Ensures the field is not empty
      isAlpha: true, // Ensures the value contains only letters
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isAlpha: true,
    },
  },
  mobileNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensures the mobile number is unique
    validate: {
      notEmpty: true,
      isNumeric: true, // Ensures the value contains only numbers
      len: [10, 10], // Ensures the value is exactly 10 digits
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensures the email is unique
    validate: {
      notEmpty: true,
      isEmail: true, // Ensures the value is a valid email
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 100], // Ensures the password is at least 6 characters
    },
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: true,
      isDate: true, // Ensures the value is a valid date
    },
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [['Male', 'Female', 'Other']], // Ensures the value is one of the allowed options
    },
  },
}, {
  tableName: 'users', // Specifies the table name in the database
  timestamps: true,
});

module.exports = User;
