const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const logger = require('../logger');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

exports.getProfile = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select('-password');
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { email, preferences } = req.body;

  await User.findByIdAndUpdate(userId, { email, preferences });
  logger.info(`User ${req.user.username} updated profile`);
  res.status(200).send('Profile updated');
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send('User not found');
  }

  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const mailOptions = {
    to: email,
    from: 'your-email@gmail.com',
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
           Please click on the following link, or paste this into your browser to complete the process:\n\n
           http://localhost:3000/reset/${token}\n\n
           If you did not request this, please ignore this email and your password will remain unchanged.\n`
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return res.status(500).send('Error sending email');
    }
    res.status(200).send('Password reset email sent');
  });
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

  if (!user) {
    return res.status(400).send('Password reset token is invalid or has expired');
  }

  user.password = bcrypt.hashSync(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).send('Password has been reset');
};