const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../logger');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey', { expiresIn: '1h' });
    logger.info(`User ${username} logged in`);
    res.status(200).json({ token });
  } else {
    logger.warn(`Invalid login attempt for user ${username}`);
    res.status(401).send('Invalid credentials');
  }
};

exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, password: hashedPassword, role });

  await newUser.save();
  logger.info(`User ${username} registered with role ${role}`);
  res.status(201).send('User registered');
};