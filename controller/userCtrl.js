const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

// register endpoint
const register = async (req, res) => {
  try {
    const { password, email, name } = req.body;

    // Check if user already exists
    const registeredUser = await userModel.findOne({ email });
    if (registeredUser) {
      return res.status(400).json({
        message: 'User already exists. Please login.',
      });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      email,
      password: encryptedPassword,
      name,
    });

  
    const registered = await newUser.save();
    if (!registered) {
      return res.status(500).json({
        message: 'User registration failed. Please try again.',
      });
    }

    // Successful registration
    return res.status(201).json({
      message: 'User registration successful',
      user: registered,
    });

  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({
      message: 'An error occurred during registration. Please try again.',
    });
  }
};

// login endpoint
const login = async (req, res) => {
  try {
    const { password, email } = req.body;

    // Check if the user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'User does not exist, please register.',
      });
    }

    // Compare provided password with the hashed password in the database

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: 'Invalid password.',
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    
    // Return the token and user info
    return res.status(200).json({
      message: 'Login successful',
      token: token, // Return the JWT token for future authentication
      user: {
        name: user.name,
        email: user.email,
      }, // Avoid returning sensitive data like password
    });

  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({
      message: 'An error occurred during login. Please try again.',
    });
  }
};

module.exports = {
  register,
  login,
};
