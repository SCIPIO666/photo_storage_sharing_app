var express = require('express');
var router = express.Router();

// 1. Home Page - The entry point "/"
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

// 2. Sign-Up Page - Renders the registration form
router.get('/users/sign-up', function(req, res, next) {
  res.render('signUp', { title: 'Create Account' });
});

// 3. Log-In Page - Renders the login form
router.get('/users/log-in', function(req, res, next) {
  res.render('logIn', { title: 'User Login' });
});

// 4. Uploads Page - Renders the multipart file form
router.get('/uploads', function(req, res, next) {
  res.render('uploads', { title: 'Upload Photos' });
});

module.exports = router;