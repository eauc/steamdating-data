module.exports = {
  db: {
    database: 'steamdating',
    username: '',
    password: '',
    params: {
      dialect: 'sqlite',
      storage: 'steamdatin.sqlite',
      logging: (sql) => {
        console.log(`[${new Date()}] ${sql}`);
      },
      define: {
        underscored: true
      }
    }
  },
  auth: {
    secret: 'EjsNcWRE1DHDf2fOt0LTbiqBI8EAwnZISH5oSacf7y1nwY2wn12JuibZg6JfyU6i'
  }
};
