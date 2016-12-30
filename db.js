import mongoose from 'mongoose';

module.exports = () => {
  mongoose.set('debug', process.env.NODE_ENV !== 'production');
  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/steamdating');
};
