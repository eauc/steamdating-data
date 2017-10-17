import R from 'ramda';
import webPush from 'web-push';

module.exports = app => {
	const auth = app.get('auth');
	const perms = app.get('perms');
	const Notification = app.models.notification;
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
				const tournamentId = req.params.id;
				Tournament
					.findById(tournamentId)
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
						return result;
					})
					.catch((error) => {
						res.status(400).json(error);
						return Promise.reject(error);
					})
					.then(({name, _id: id}) => {
						return sendNotificationsForTournament({name, id});
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

	app.route('/tournaments/:id/notifications')
		.post((req, res) => {
			const tournamentId = req.params.id;
			const {endpoint, keys} = req.body;
			Tournament
				.findById(tournamentId)
				.exec()
				.then((tournament) => {
					if (R.isNil(tournament)) {
						return Promise.reject({
							message: "Tournament not found",
							name: "ValidationError",
							tournamentId,
						});
					}
					return Notification
						.findOne({endpoint})
						.exec();
				}).then((notification) => {
					if (!R.isNil(notification)) {
						return null;
					}
					return new Notification({
						tournament: req.params.id,
						endpoint,
						keys,
					}).save();
				})
				.then((result) => {
					res.status(204).end();
				})
				.catch(error => {
					res.status(400).json(error);
				});
		});

	if(process.env.NODE_ENV !== "production") {
		app.route('/test/tournaments/all')
			.delete((req, res) => {
				Tournament
					.remove()
					.then((result) => {
						res.status(200).json(result);
					})
					.catch(error => {
						res.status(400).json(error);
					});
			});
	}

	function sendNotificationsForTournament({name, id}) {
		return Notification
			.find({tournament: id})
			.then((notifications) => {
				console.log(`Sending ${R.length(notifications)} notifications.`, {name, id});
				return Promise.all(R.map((notification) => {
					return webPush.sendNotification(
						R.pick(["endpoint", "keys"], notification),
						JSON.stringify({name, id})
					);
				}, notifications));
			})
			.catch((error) => {
				console.error("Send notifications error", error);
			});
	}
};

function addResourceLink(tournament) {
	return R.assoc(
		'link',
		`/tournaments/${tournament._id}`,
		tournament.toObject()
	);
}
