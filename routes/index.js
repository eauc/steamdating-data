module.exports = app => {
  app.get('/', (_req_, res) => {
    res.json({
      status: 'SteamDating Data API',
      version: '1.0.0',
      tournaments: {
        link: '/tournaments',
        mine: '/tournaments/mine'
      }
    });
  });
};
