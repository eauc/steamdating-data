module.exports = {
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
};
