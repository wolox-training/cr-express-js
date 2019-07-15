exports.config = {
  environment: 'production',
  common: {
    database: {
      name: process.env.DATABASE_URL
    }
  },
  isProduction: true
};
