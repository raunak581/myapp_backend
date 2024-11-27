const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const nodemailer = require('nodemailer');
const { ClothingItem, ClothingImage } = require("../database/login")
const User = require('../user');
ClothingItem.associate({ ClothingImage });
ClothingImage.associate({ ClothingItem });

// Register User
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'raunakdubey681@gmail.com',
    pass: 'yrmn zzvz albw hzii',
  },
});


// Registration Route
router.post('/register', async (req, res) => {
  const { username, email, mobile, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user (but set as inactive initially)
    user = await User.create({
      username,
      email,
      mobile,
      password: hashedPassword,
      isConfirmed: false, // User is not confirmed initially
    });

    // Create email confirmation token
    const emailConfirmationToken = jwt.sign(
      { email: user.email },
      's3cr3tK3y@2024!jwt', // Replace with your JWT secret
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Send confirmation email
    const confirmationUrl = `http://your-domain.com/confirm-email/${emailConfirmationToken}`;
    await transporter.sendMail({
      to: user.email,
      subject: 'Email Confirmation',
      html: `<p>Please confirm your email by clicking the following link: <a href="${confirmationUrl}">${confirmationUrl}</a></p>`,
    });
    console.log(emailConfirmationToken);


    // Return a success message
    res.json({ msg: 'Registration successful! Please check your email to confirm your account.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Email Confirmation Route
router.get('/confirm-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, 's3cr3tK3y@2024!jwt'); // Replace with your JWT secret

    // Find the user by email
    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid token' });
    }

    // Check if user is already confirmed
    if (user.isConfirmed) {
      return res.status(400).json({ msg: 'Email is already confirmed' });
    }

    // Update the user's isConfirmed field
    user.isConfirmed = true;
    await user.save(); // Save the user with the updated isConfirmed status

    // Check if the update was successful
    const updatedUser = await User.findOne({ where: { email: decoded.email } });

    if (updatedUser.isConfirmed) {
      res.json({ msg: 'Email confirmed successfully! Your account is now active.' });
    } else {
      res.status(500).json({ msg: 'Error updating confirmation status in the database' });
    }
  } catch (err) {
    console.error(err.message);

    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ msg: 'Confirmation link has expired' });
    }

    res.status(500).send('Server error');
  }
});







// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Check if the user's email is confirmed
    if (!user.isConfirmed) {
      return res.status(400).json({ msg: 'Please confirm your email before logging in' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        userEmail: user.email,
      },
    };

    jwt.sign(
      payload,
      's3cr3tK3y@2024!jwt', // Replace with your JWT secret
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          userId: user.id,
          userEmail: user.email,
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/clothing-item', async (req, res) => {
  try {
    // Fetch all rows from the database
    const items = await ClothingItem.findAll();
    return res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching clothing items:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/clothing-item/:id', async (req, res) => {
  try {
    const clothingItem = await ClothingItem.findByPk(req.params.id, {
      include: [{ model: ClothingImage, as: 'images' }],
    });

    if (!clothingItem) {
      return res.status(404).json({ error: 'Clothing item not found' });
    }

    return res.status(200).json(clothingItem);
  } catch (error) {
    console.error('Error fetching clothing item:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});




// Registration Endpoint
router.post('/registeration', async (req, res) => {
  const { firstName, lastName, mobileNo, email, password, dateOfBirth, gender } = req.body;
  if (!firstName || !lastName || !mobileNo || !email || !password || !dateOfBirth || !gender) {
    return res.status(400).json({
      msg: 'All fields are required: firstName, lastName, mobileNo, email, password, dateOfBirth, gender',
    });
  }

  try {
    // Check if the user already exists (by email or mobile number)
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    user = await User.findOne({ where: { mobileNo } });
    if (user) {
      return res.status(400).json({ msg: 'User with this mobile number already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    user = await User.create({
      firstName,
      lastName,
      mobileNo,
      email,
      password: hashedPassword,
      dateOfBirth,
      gender,
    });

    // Generate JWT token (optional, for immediate login or other purposes)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      's3cr3tK3y@2024!jwt', // Replace with your JWT secret
      { expiresIn: '1h' }
    );

    // Return success response
    res.status(201).json({
      msg: 'Registration successful!',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        mobileNo: user.mobileNo,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
      },
      token, // Optional
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});



// Adjust path based on your project structure

// POST: Check if mobile number exists
router.post('/check-mobile', async (req, res) => {
  const { mobileNo } = req.body;

  try {
    // Check if the mobile number exists in the database
    const user = await User.findOne({ where: { mobileNo } });

    if (user) {
      // Mobile number exists
      return res.status(200).json({ exists: true, msg: 'Mobile number exists',mobileNo:mobileNo, });
    } else {
      // Mobile number does not exist
      return res.status(200).json({ exists: false, msg: 'Mobile number does not exist' });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

module.exports = router;




module.exports = router;
