const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const { databaseError } = require('../errors');
const { bad_request_error } = require('../errors');
const { conflict_error } = require('../errors');
const userModel = require('../models').user;

exports.register = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty() === false) {
    console.log(errors);
    next(bad_request_error(errors.array()));
  }
  if (req.user) {
    next(conflict_error('user already exists!'));
  } else {
    userModel
      .create({
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt)
      })
      .then(userCreated => {
        console.log(`User with name ${userCreated.name} created!!`);
        res.send(JSON.stringify(userCreated));
      })
      .catch(error => {
        next(databaseError(error));
      });
  }
};
