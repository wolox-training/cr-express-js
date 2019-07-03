const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALT));

exports.encryptPassword = password => bcrypt.hashSync(password, salt);
