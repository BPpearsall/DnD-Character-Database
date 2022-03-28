const router = require('express').Router();
const { Character, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        const characterData = await Character.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name']
                },
            ],
        });

        const characters = characterData.map((character) => character.get({ plain: true}));

        res.render('homepage', {
            characters
        })
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/character/:id', withAuth, async (req, res) => {
    try {
        const characterData = await Character.findByPk(req.session.id)

        const character = characterData.get({ plain: true });

        res.render('character', {
            ...character,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(400).json(err)
    }
});

router.get('/profile', withAuth, async (req, res) => {
    try {
      // Find the logged in user based on the session ID
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Project }],
      });
  
      const user = userData.get({ plain: true });
  
      res.render('profile', {
        ...user,
        logged_in: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });


router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect('/homepage');
      return;
    }
  
    res.render('login');
  });