import bodyParser from 'body-parser';
// import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
// import expressJWTPermissions from 'express-jwt-permissions';

// const guard = expressJWTPermissions();

module.exports = app => {
  app.set('port', process.env.PORT || 4000);
  app.set('json spaces', 4);
  app.use(helmet());
  app.use(cors({
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  // app.use(app.get('auth'));
  // app.use(guard.check('user:default'));
  // app.use(compression());
  app.use(bodyParser.json());
  app.use((req, _res_, next) => {
    delete req.body.id;
    next();
  });
};
