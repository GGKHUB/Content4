const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
require('dotenv').config();

// Import database and models
const sequelize = require('./config/database');
const { User, Post, Like, Comment } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from Angular build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// Static file serving with error handling
app.use('/uploads', (req, res, next) => {
  const fs = require('fs');
  const path = require('path');
  
  // Decode the URL-encoded filename
  const decodedPath = decodeURIComponent(req.path);
  const filePath = path.join(__dirname, 'uploads', decodedPath);
  
  console.log(`🔍 Looking for file: ${decodedPath}`);
  console.log(`🔍 Full path: ${filePath}`);
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    console.log(`✅ File found: ${decodedPath}`);
    // File exists, serve it
    express.static(path.join(__dirname, 'uploads'))(req, res, next);
  } else {
    // File doesn't exist, return 404 with a default image or error
    console.log(`⚠️  File not found: ${decodedPath}`);
    console.log(`⚠️  Full path: ${filePath}`);
    res.status(404).json({ 
      message: 'Image not found',
      error: 'File not found',
      path: decodedPath 
    });
  }
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit to match frontend
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Initialize database connection
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('SQL Server connection has been established successfully.');
    
    // Sync models
    await sequelize.sync({ force: false });
    console.log('Database tables synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

// Routes

// Register
app.post('/api/register', [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
app.post('/api/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile: {
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          location: user.location,
          favoriteCarBrand: user.favoriteCarBrand,
          profilePicture: user.profilePicture,
          joinDate: user.joinDate
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        location: user.location,
        favoriteCarBrand: user.favoriteCarBrand,
        profilePicture: user.profilePicture,
        joinDate: user.joinDate
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
app.put('/api/profile', authenticateToken, [
  body('firstName').optional().isLength({ min: 1 }).withMessage('First name cannot be empty'),
  body('lastName').optional().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, bio, location, favoriteCarBrand } = req.body;

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      bio: bio || user.bio,
      location: location || user.location,
      favoriteCarBrand: favoriteCarBrand || user.favoriteCarBrand
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile: {
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          location: user.location,
          favoriteCarBrand: user.favoriteCarBrand,
          profilePicture: user.profilePicture,
          joinDate: user.joinDate
        }
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload profile picture
app.post('/api/profile/picture', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    await user.update({ profilePicture: imageUrl });

    res.json({
      message: 'Profile picture updated successfully',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture']
        },
        {
          model: Like,
          as: 'likes',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture']
            }
          ]
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture']
            }
          ],
          order: [['createdAt', 'ASC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    // Transform the data to match frontend expectations
    const transformedPosts = posts.map(post => ({
      ...post.toJSON(),
      userId: post.user ? {
        id: post.user.id,
        username: post.user.username,
        firstName: post.user.firstName,
        lastName: post.user.lastName,
        profilePicture: post.user.profilePicture
      } : null, // Move user data to userId field
      user: undefined, // Remove the original user field
      likes: post.likes.map(like => ({
        ...like.toJSON(),
        id: like.user.id,
        username: like.user.username,
        firstName: like.user.firstName,
        lastName: like.user.lastName,
        profilePicture: like.user.profilePicture,
        user: undefined // Remove the nested user field
      })),
      comments: post.comments.map(comment => ({
        ...comment.toJSON(),
        userId: {
          id: comment.user.id,
          username: comment.user.username,
          firstName: comment.user.firstName,
          lastName: comment.user.lastName,
          profilePicture: comment.user.profilePicture
        }, // Move user data to userId field
        user: undefined // Remove the nested user field
      }))
    }));
    
    res.json(transformedPosts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's posts
app.get('/api/posts/user/:userId', async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { userId: req.params.userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture']
        },
        {
          model: Like,
          as: 'likes',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture']
            }
          ]
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture']
            }
          ],
          order: [['createdAt', 'ASC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    // Transform the data to match frontend expectations
    const transformedPosts = posts.map(post => ({
      ...post.toJSON(),
      userId: post.user ? {
        id: post.user.id,
        username: post.user.username,
        firstName: post.user.firstName,
        lastName: post.user.lastName,
        profilePicture: post.user.profilePicture
      } : null, // Move user data to userId field
      user: undefined, // Remove the original user field
      likes: post.likes.map(like => ({
        ...like.toJSON(),
        id: like.user.id,
        username: like.user.username,
        firstName: like.user.firstName,
        lastName: like.user.lastName,
        profilePicture: like.user.profilePicture,
        user: undefined // Remove the nested user field
      })),
      comments: post.comments.map(comment => ({
        ...comment.toJSON(),
        userId: {
          id: comment.user.id,
          username: comment.user.username,
          firstName: comment.user.firstName,
          lastName: comment.user.lastName,
          profilePicture: comment.user.profilePicture
        }, // Move user data to userId field
        user: undefined // Remove the nested user field
      }))
    }));
    
    res.json(transformedPosts);
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create post
app.post('/api/posts', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    console.log('📤 POST /api/posts - Request received');
    console.log('📤 File info:', req.file ? `Filename: ${req.file.filename}, Size: ${req.file.size}` : 'No file');
    console.log('📤 Body info:', { caption: req.body.caption, userId: req.user?.userId });
    
    if (!req.file) {
      console.log('❌ No image uploaded');
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const { caption } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    console.log('📤 Creating post with:', { userId: req.user.userId, caption, imageUrl });
    
    const post = await Post.create({
      userId: req.user.userId,
      caption: caption || '',
      imageUrl: imageUrl
    });
    
    console.log('✅ Post created successfully with ID:', post.id);

    // Fetch the created post with associations
    const createdPost = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture']
        },
        {
          model: Like,
          as: 'likes',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture']
            }
          ]
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture']
            }
          ]
        }
      ]
    });

    // Transform the data to match frontend expectations
    const transformedPost = {
      ...createdPost.toJSON(),
      userId: createdPost.user ? {
        id: createdPost.user.id,
        username: createdPost.user.username,
        firstName: createdPost.user.firstName,
        lastName: createdPost.user.lastName,
        profilePicture: createdPost.user.profilePicture
      } : null, // Move user data to userId field
      user: undefined, // Remove the original user field
      likes: createdPost.likes.map(like => ({
        ...like.toJSON(),
        id: like.user.id,
        username: like.user.username,
        firstName: like.user.firstName,
        lastName: like.user.lastName,
        profilePicture: like.user.profilePicture,
        user: undefined // Remove the nested user field
      })),
      comments: createdPost.comments.map(comment => ({
        ...comment.toJSON(),
        userId: {
          id: comment.user.id,
          username: comment.user.username,
          firstName: comment.user.firstName,
          lastName: comment.user.lastName,
          profilePicture: comment.user.profilePicture
        }, // Move user data to userId field
        user: undefined // Remove the nested user field
      }))
    };

    res.status(201).json({
      message: 'Post created successfully',
      post: transformedPost
    });
  } catch (error) {
    console.error('❌ Create post error:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like/Unlike post
app.post('/api/posts/:postId/like', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;

    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already liked the post
    const existingLike = await Like.findOne({
      where: { userId, postId }
    });

    if (existingLike) {
      // Unlike the post
      await existingLike.destroy();
    } else {
      // Like the post
      await Like.create({ userId, postId });
    }

    // Get updated likes count and likers
    const likes = await Like.findAll({
      where: { postId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture']
        }
      ]
    });

    res.json({
      message: existingLike ? 'Post unliked' : 'Post liked',
      likes: likes,
      likesCount: likes.length
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add comment
app.post('/api/posts/:postId/comments', authenticateToken, [
  body('text').notEmpty().withMessage('Comment text is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const postId = req.params.postId;
    const userId = req.user.userId;
    const { text } = req.body;

    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create comment
    const comment = await Comment.create({
      userId,
      postId,
      text
    });

    // Fetch comment with user details
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture']
        }
      ]
    });

    // Transform comment data to match frontend expectations
    const transformedComment = {
      ...commentWithUser.toJSON(),
      userId: {
        id: commentWithUser.user.id,
        username: commentWithUser.user.username,
        firstName: commentWithUser.user.firstName,
        lastName: commentWithUser.user.lastName,
        profilePicture: commentWithUser.user.profilePicture
      },
      user: undefined // Remove the nested user field
    };

    res.status(201).json({
      message: 'Comment added successfully',
      comment: transformedComment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile by ID
app.get('/api/users/:userId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      attributes: ['id', 'username', 'firstName', 'lastName', 'bio', 'location', 'favoriteCarBrand', 'profilePicture', 'joinDate']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Serve Angular app for all non-API routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected field in file upload.' });
    }
  }
  
  // Handle file system errors (like ENOENT - file not found)
  if (error.code === 'ENOENT') {
    console.log(`⚠️  File not found: ${error.path}`);
    return res.status(404).json({ 
      message: 'File not found',
      error: 'The requested file does not exist',
      path: error.path 
    });
  }
  
  console.error('Server error:', error);
  res.status(500).json({ message: 'Server error', error: error.message });
});

// Start server
async function startServer() {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);