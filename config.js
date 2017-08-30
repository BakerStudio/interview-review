exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost:27017/interview';
                      // 'mongodb://dbuser:dbpass@ds149437.mlab.com:49437/interview';
exports.PORT = process.env.PORT || 8080;
