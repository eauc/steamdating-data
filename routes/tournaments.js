import R from 'ramda';

module.exports = app => {
  const auth = app.get('auth');
  const perms = app.get('perms');
  const Tournament = app.models.tournament;
  app.route('/tournaments')
    .get((_req_, res) => {
      Tournament
        .find()
        .sort('-date')
        .select('_id user name date updatedAt')
        .exec()
        .then((result) => {
          const tournaments = R.map(addResourceLink, result);
          res.json({
            link: '/tournaments',
            tournaments,
          });
        })
        .catch((error) => {
          res.status(400).json(error);
        });
    });

  app.use('/tournaments/mine',
          auth,
          perms.check('user:tournament_organizer'));
  app.route('/tournaments/mine')
    .get((req, res) => {
      Tournament
        .find({ user: req.user.email })
        .sort('-date')
        .select('_id user name date updatedAt')
        .exec()
        .then((result) => {
          const tournaments = R.map(addResourceLink, result);
          res.json({
            link: '/tournaments/mine',
            tournaments,
          });
        })
        .catch(error => {
          res.status(400).json(error);
        });
    })
    .post((req, res) => {
      req.body.user = req.user.email;
      // console.log('create', req.body);
      new Tournament(req.body)
        .save()
        .then((result) => {
          res.status(201).json(R.pick(
            ['_id','user','name','date','updatedAt','link'],
            addResourceLink(result)
          ));
        })
        .catch(error => {
          res.status(400).json(error);
        });
    });

  app.route('/tournaments/:id')
    .get((req, res) => {
      Tournament
        .findById(req.params.id)
        .select('_id user name date updatedAt tournament')
        .exec()
        .then((result) => {
          if(R.isNil(result)) {
            return res.status(404).json({ message: 'not found' });
          }
          return res.json(addResourceLink(result));
        })
        .catch(error => {
          res.status(400).json(error);
        });
    })
    .put(
      auth,
      perms.check('user:tournament_organizer'),
      (req, res) => {
        Tournament
          .findById(req.params.id)
          .exec()
          .then((result) => {
            R.pipe(
              R.keys,
              R.without(['_id','__v','updatedAt','createdAt','user']),
              R.reject((key) => R.isNil(req.body[key])),
              R.forEach((key) => {
                // console.log('Update', result._id, key, req.body[key]);
                result[key] = req.body[key];
              })
            )(Tournament.schema.paths);
            return result.save();
          })
          .then((result) => {
            res.json(R.pick(
              ['_id','user','name','date','updatedAt','link'],
              addResourceLink(result)
            ));
          })
          .catch((error) => {
            res.status(400).json(error);
          });
      }
    )
    .delete(
      auth,
      perms.check('admin'),
      (req, res) => {
        Tournament
          .remove({ _id: req.params.id })
          .then((result) => {
            res.status(200).json(result);
          })
          .catch(error => {
            res.status(400).json(error);
          });
      });
};

function addResourceLink(tournament) {
  return R.assoc(
    'link',
    `/tournaments/${tournament._id}`,
    tournament.toObject()
  );
}
