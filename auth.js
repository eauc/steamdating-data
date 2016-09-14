import jwt from 'express-jwt';
import expressJWTPermissions from 'express-jwt-permissions';

module.exports = app => {
  const config = app.libs.config.auth || {};
  app.set('auth', jwt({
    secret: new Buffer(
      process.env.AUTH_SECRET || config.secret,
      'base64'
    )
  }));
  app.set('perms', expressJWTPermissions());
};
