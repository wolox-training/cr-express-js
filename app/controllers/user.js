const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const userModel = require('../models').user;

const register = (req, res, next) => {
  try {
    const errors = validationResult(req);
    // Validation error
    if (!errors.isEmpty()) {
      console.log(errors);
      res.status(422).send(JSON.stringify(errors.array()));
    } else {
      // Find email
      userModel
        .findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            res.send('User with that email already exists!');
          } else {
            // Create user
            userModel
              .create({
                name: req.body.name,
                lastname: req.body.lastname,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, salt)
              })
              .then(userCreated => {
                console.log(`User with name ${userCreated.name} created!!`);
                res.send(JSON.stringify(userCreated));
              })
              .catch(err => {
                console.log(err);
                // res.send(err);
                next(err);
              });
          }
        })
        .catch(err => {
          console.log(err);
          next(err);
        });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = { register };
