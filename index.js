import express from 'express';
import consign from 'consign';

const app = express();

consign({ verbose: process.env.NODE_ENV !== 'production' })
  .include('libs/config.js')
  .then('db.js')
  .then('models')
  .then('auth.js')
  .then('libs/middlewares.js')
  .then('libs/webPush.js')
  .then('routes')
  .then('libs/boot.js')
  .into(app);

module.exports = app;
