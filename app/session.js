let admin = false;

exports.isAdmin = () => admin;

exports.setAdmin = () => {
  admin = true;
};

exports.setDefault = () => {
  admin = false;
};
