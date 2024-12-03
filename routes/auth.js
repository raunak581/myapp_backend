const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const nodemailer = require('nodemailer');
const { ClothingItem, ClothingImage, WishlistItem, Cartitem, sequelize } = require("../database/login")
const User = require('../user');
ClothingItem.associate({ ClothingImage });
ClothingImage.associate({ ClothingItem });
const { Op } = require('sequelize');


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
    const user = await User.findOne({
      where: { mobileNo },
      attributes: [
        'id',
        'firstName',
        'lastName',
        'mobileNo',
        'email',
        'password',
        'dateOfBirth',
        'gender'
      ]
    });

    if (user) {
      // Mobile number exists
      return res.status(200).json({
        exists: true,
        msg: 'Mobile number exists',
        user: user // Send all user details
      });
    } else {
      // Mobile number does not exist
      return res.status(200).json({ exists: false, msg: 'Mobile number does not exist' });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Server error', error: error.message });
  }
});



router.post('/add', async (req, res) => {
  try {
    const { Id, itemId, name, price, imageUrl } = req.body;

    // Check if the user exists; if not, create a new user (simplified for this example)
    let user = await User.findByPk(Id);
    if (!user) {
      user = await User.create({ id: userId });
    }

    // Check if the item is already in the wishlist
    const existingItem = await WishlistItem.findOne({
      where: { userId: user.id, itemId },
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    // Add item to wishlist
    const wishlistItem = await WishlistItem.create({
      userId: user.id,
      itemId,
      name,
      price,
      imageUrl,
    });

    const wishlistCount = await WishlistItem.count({
      where: { userId: user.id },
    });

    res.status(200).json({ message: 'Item added to wishlist', wishlist_count: wishlistCount,wishlistItem:wishlistItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Remove item from wishlist
router.delete('/remove', async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const result = await WishlistItem.destroy({
      where: { userId, itemId },
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }

    res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all wishlist items for the given userId
    const wishlistItems = await WishlistItem.findAll({
      where: { userId },
      attributes: ['itemId', 'name', 'price', 'imageUrl'],
    });

    res.status(200).json({
      success: true,
      data: wishlistItems,
    });
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist items',
      error: error.message,
    });
  }
});



//cart items add

router.post('/addcart', async (req, res) => {
  try {
    const { Id, itemId, name, price, imageUrl, quantity } = req.body;

    // Check if the user exists; if not, create a new user (simplified for this example)
    let user = await User.findByPk(Id);
    if (!user) {
      user = await User.create({ id: userId });
    }

    // Check if the item is already in the wishlist
    const existingItem = await Cartitem.findOne({
      where: { userId: user.id, itemId },
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    // Add item to wishlist
    const Cartitems = await Cartitem.create({
      userId: user.id,
      itemId,
      name,
      price,
      imageUrl,
      quantity
    });
    const cartCount = await Cartitem.count({
      where: { userId: user.id },
    });

    res.status(200).json({ message: 'Item added to cart', cartCount,Cartitems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//delete


router.delete('/removecart', async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const result = await Cartitem.destroy({
      where: { userId, itemId },
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/cartuser/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all wishlist items for the given userId
    const Cartitems = await Cartitem.findAll({
      where: { userId },
      attributes: ['itemId', 'name', 'price', 'imageUrl', 'quantity'],
    });

    if (Cartitems.length == 0) {
      res.status(201).json({
        success: true,
        data: "no items in your cart",
      });


    }
    else {

      res.status(200).json({
        success: true,
        data: Cartitems,
      });
    }
  } catch (error) {
    // console.error('Error fetching wishlist items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist items',
      error: error.message,
    });
  }
});


//for serach 

router.get('/items', async (req, res) => {
  const searchTerm = req.query.search || '';

  try {
    const items = await ClothingItem.findAll({
      where: {
        name: {
          [Op.like]: `%${searchTerm}%` // Match items containing the search term
        }
      }
    });

    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Server error');
  }
});


//no of items in cart and wishlist

router.get('/counts/:userId', async (req, res) => {
  const { userId } = req.params; // Extract userId from route parameters

  try {
    // Corrected SQL query
    const results = await sequelize.query(`
      SELECT 
        (SELECT COUNT(*) FROM cartitems WHERE userId = :userId) AS cartitems_count,
        (SELECT COUNT(*) FROM wishlistitems WHERE userId = :userId) AS wishlist_count
    `, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { userId }, // Use replacements for parameterized query
    });

    // Log the results for debugging
    console.log('Query Results:', results);

    // Ensure results exist
    if (results.length > 0) {
      res.status(200).json({
        success: true,
        data: results[0], // Results in the format { cartitems_count: X, wishlist_count: Y }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No data found for the given userId.',
      });
    }
  } catch (error) {
    console.error('Error fetching row counts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch row counts.',
      error: error.message,
    });
  }
});



module.exports = router;







