import { Router, Request, Response } from 'express';
import { DataStore } from '../utils/dataStore';
import { User } from '../types';

export const authRouter = Router();

// Register endpoint
authRouter.post('/register', (req: Request, res: Response) => {
  const { username, userId, phoneNumber } = req.body;
  
  // Validation
  if (!username || !userId || !phoneNumber) {
    return res.status(400).json({
      success: false,
      message: 'Username, user ID, and phone number are required'
    });
  }
  
  // Check if user already exists
  const existingUser = DataStore.getUserById(userId);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User ID already exists'
    });
  }
  
  const existingUsername = DataStore.getUserByUsername(username);
  if (existingUsername) {
    return res.status(409).json({
      success: false,
      message: 'Username already exists'
    });
  }
  
  // Create new user
  const newUser: User = {
    id: userId,
    username,
    phoneNumber,
    createdAt: new Date().toISOString()
  };
  
  DataStore.addUser(newUser);
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: newUser
  });
});

// Login endpoint
authRouter.post('/login', (req: Request, res: Response) => {
  const { userId, phoneNumber } = req.body;
  
  // Validation
  if (!userId || !phoneNumber) {
    return res.status(400).json({
      success: false,
      message: 'User ID and phone number are required'
    });
  }
  
  // Find user
  const user = DataStore.getUserById(userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Verify phone number
  if (user.phoneNumber !== phoneNumber) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  res.status(200).json({
    success: true,
    message: 'Login successful',
    user: user
  });
});
