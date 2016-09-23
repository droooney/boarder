const jwt = require('jsonwebtoken');
const { isEmail } = require('validator');
const User = require('../db/models/user');
const hashPassword = require('../helpers/hash-password');
const { secret } = require('../../config/config.json');

module.exports = {
  checkLogin(req, res, next) {
    const {
      login = ''
    } = req.query;

    User
      .findOne({
        where: { login }
      })
      .then((user) => {
        res.json({ error: user && 'Login must be unique' });
      })
      .catch(next);
  },

  checkEmail(req, res, next) {
    const {
      email = ''
    } = req.query;

    if (!isEmail(email)) {
      return res.json({ error: 'Validation isEmail failed' });
    }

    User
      .findOne({
        where: { email }
      })
      .then((user) => {
        res.json({
          error: user && 'Email must be unique'
        });
      })
      .catch(next);
  },

  register(req, res, next) {
    const {
      email = '',
      login = '',
      password = ''
    } = req.body;

    User
      .create({
        email,
        login,
        password
      })
      .then(() => {
        res.json({ errors: null });
      })
      .catch((err) => {
        const { errors } = err;

        if (!errors) {
          return next(err);
        }

        res.json({
          errors: errors.map(({ message, path }) => ({
            field: path,
            message
          }))
        });
      });
  },

  login(req, res, next) {
    const {
      login = '',
      password: origPassword = ''
    } = req.body;
    const password = hashPassword(origPassword);
    const where = isEmail(login)
      ? { email: login, password }
      : { login, password };

      console.log(where);

    User
      .findOne({ where })
      .then((user) => {
        if (!user) {
          return res.json(null);
        }

        jwt.sign(user.email, secret, { algorithm: 'HS256' }, (err, token) => {
          if (err) {
            return next(err);
          }

          res.cookie('boarder_email_cookie', token, {
            httpOnly: true
          });
          res.json(user);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
