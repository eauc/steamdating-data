module.exports = app => {
  app.listen(app.get('port'), () => {
    console.log(`Steamdating API - Port ${app.get('port')}`);
  });
};
