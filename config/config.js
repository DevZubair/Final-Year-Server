var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'fyp-server'
    },
    port: process.env.PORT || 3000,
    secret : "hospitalwaitapp",
    db: 'mongodb://Zubair:admin@ds045604.mongolab.com:45604/fyp-database'
  },

  test: {
    root: rootPath,
    app: {
      name: 'fyp-server'
    },
    port: process.env.PORT || 3000,
    secret : "hospitalwaitapp",
    db: 'mongodb://Zubair:admin@ds045604.mongolab.com:45604/fyp-database'
  },

  production: {
    root: rootPath,
    app: {
      name: 'fyp-server'
    },
    port: process.env.PORT || 3000,
    secret : "hospitalwaitapp",
    db: 'mongodb://Zubair:admin@ds045604.mongolab.com:45604/fyp-database'
  }
};

module.exports = config[env];
