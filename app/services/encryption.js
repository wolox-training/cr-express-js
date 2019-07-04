const bcrypt = require('bcryptjs');
const { salt_sync } = require('../../config').encryption;
const salt = bcrypt.genSaltSync(parseInt(salt_sync));

exports.encryptPassword = password => bcrypt.hashSync(password, salt);

exports.validatePasssword = (passwordBody, passwordUser) => bcrypt.compareSync(passwordBody, passwordUser);
