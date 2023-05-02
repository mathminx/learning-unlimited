const router = require('express').Router();
const { User } = require('../../model');

router.get('/', async (req, res) => {
  // Send the rendered login page back as the response
  res.render('homepage');
});

router.get('/login', async (req, res) => {
  // Send the rendered login page back as the response
  res.render('login');
});

router.post('/', async (req, res) => {
  try {
    // Find the user who matches the posted e-mail address
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });const router = require('express').Router();
        const {User} = require("../model");
        
        router.get('/', async (req, res) => {
          // Send the rendered Handlebars.js template back as the response
          res.render('login');
        });
        
        module.exports = router;
        
      return;
    }

    // Verify the posted password with the password store in the database
    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    // Create session variables based on the logged in user
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    // Remove the session variables
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
