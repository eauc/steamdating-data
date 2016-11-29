import R from 'ramda';

module.exports = app => {
  const auth = app.get('auth');
  const perms = app.get('perms');
  const Tournaments = app.db.models.Tournaments;
  app.route('/tournaments')
    .get((_req_, res) => {
      Tournaments.findAll({
        attributes: ['id', 'name', 'date', 'updated_at']
      }).then(result => {
        const data = R.map(addResourceLink, result);
        res.json({ link: '/tournaments',
                   data });
      }).catch(error => {
        res.status(412).json({msg: error.message});
      });
    });

  app.use('/tournaments/mine',
          auth,
          perms.check('user:tournament_organizer'));
  app.route('/tournaments/mine')
    .get((req, res) => {
      Tournaments.findAll({
        where: {
          user: req.user.email
        },
        attributes: ['id', 'name', 'date', 'updated_at']
      }).then(result => {
        const data = R.map(addResourceLink, result);
        res.json({ link: '/tournaments/mine',
                   data });
      }).catch(error => {
        res.status(412).json({msg: error.message});
      });
    })
    .post((req, res) => {
      req.body.user = req.user.email;
      console.log('create', req.body);
      Tournaments.create(req.body)
        .then(result => {
          res.json({ link: `/tournaments/${result.id}`,
                     data: R.omit(['data'], result)
                   });
        })
        .catch(error => {
          res.status(412).json({msg: error.message});
        });
    });

  app.route('/tournaments/:id')
    .get((req, res) => {
      Tournaments.findOne({
        where: {
          id: req.params.id
        }
      }).then(result => {
        if (result) {
          res.json({ link: `/tournaments/${result.id}`,
                     data: result
                   });
        } else {
          res.sendStatus(404);
        }
      }).catch(error => {
        res.status(412).json({msg: error.message});
      });
    })
    .put(
      auth,
      perms.check('user:tournament_organizer'),
      (req, res) => {
        console.log(req);
        console.log(req.body);
        Tournaments.update(req.body, {
          where: {
            id: req.params.id,
            user: req.user.email
          }
        }).then(() => Tournaments.findOne({
          where: {
            id: req.params.id
          }
        })).then(result => {
          res.json({ link: `/tournaments/${result.id}`,
                     data: R.omit(['data'], result)
                   });
        }).catch(error => {
          res.status(412).json({msg: error.message});
        });
      })
    .delete(
      auth,
      perms.check('admin'),
      (req, res) => {
        Tournaments.destroy({
          where: {
            id: req.params.id,
            user: req.user.email
          }
        }).then(() => {
          res.sendStatus(204);
        }).catch(error => {
          res.status(412).json({msg: error.message});
        });
      });
};

function addResourceLink(tournament) {
  return R.assoc(
    'link',
    `/tournaments/${tournament.id}`,
    tournament.dataValues
  );
}
