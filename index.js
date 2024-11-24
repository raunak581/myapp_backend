const express = require('express');
// const { User, Thread } = require('../API/models/assistion');
const { DataTypes } = require('sequelize');



const cors = require('cors'); // Import CORS

const { connectDB, sequelize } = require('../backend/database/login');

const authRoutes = require('./routes/auth'); // Import your auth routes

const app = express();
const PORT = process.env.PORT || 5002;

// Enable CORS
app.use(cors());

// Init Middleware
app.use(express.json());
// app.use(bodyParser.json());

// Connect Database
connectDB();

sequelize.sync({}).then(() => {
  console.log('Database & tables created!');
});


// Define Auth Routes
app.use('/api/auth', authRoutes);

// Chat Route



// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
