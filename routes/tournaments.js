// import expressJWTPermissions from 'express-jwt-permissions';

// const guard = expressJWTPermissions();

module.exports = app => {
  const auth = app.get('auth');
  const perms = app.get('perms');
  const Tournaments = app.db.models.Tournaments;
  app.route('/tournaments')
    .get((req, res) => {
      console.log(req.user);
      Tournaments.findAll()
        .then(result => res.json(result))
        .catch(error => {
          res.status(412).json({msg: error.message});
        });
    })
    .post((req, res) => {
      // req.body.user = req.user.email;
      Tournaments.create(req.body)
        .then(result => res.json(result))
        .catch(error => {
          res.status(412).json({msg: error.message});
        });
    });

  // app.route('/tournaments/:id')
  //   .get((req, res) => {
  //     Tournaments.findOne({
  //       where: {
  //         id: req.params.id,
  //         user: req.user.email
  //       }
  //     }).then(result => {
  //         if (result) {
  //           res.json(result);
  //         } else {
  //           res.sendStatus(404);
  //         }
  //       })
  //       .catch(error => {
  //         res.status(412).json({msg: error.message});
  //       });
  //   })
  //   .put((req, res) => {
  //     Tournaments.update(req.body, {
  //       where: {
  //         id: req.params.id,
  //         user: req.user.email
  //       }
  //     }).then(result => res.sendStatus(204).json(result))
  //       .catch(error => {
  //         res.status(412).json({msg: error.message});
  //       });
  //   })
  //   .delete(guard.check('admin:default'), (req, res) => {
  //     Tournaments.destroy({
  //       where: {
  //         id: req.params.id,
  //         user: req.user.email
  //       }
  //     }).then(() => res.sendStatus(204))
  //       .catch(error => {
  //         res.status(412).json({msg: error.message});
  //       });
  //   });
};
