const express = require('express');
const passport = require('passport');
const { login, register } = require('../controllers/authController');
const router = express.Router();

// Initiate authentication with Azure AD
router.get('/login', passport.authenticate('azure_ad_oauth2'));

// Handle the callback from Azure AD
router.get('/callback',
  passport.authenticate('azure_ad_oauth2', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard'); // Redirect to the dashboard on successful login
  }
);

router.post('/login', login);
router.post('/register', register);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;