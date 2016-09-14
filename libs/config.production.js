module.exports = {
  db: {
    database: process.env.DATABASE_URL,
    username: '',
    password: '',
    params: {
      dialect: 'postgres',
      protocol: 'postgres',
      logging: (sql) => {
        console.log(`[${new Date()}] ${sql}`);
      },
      define: {
        underscored: true
      }
    }
  },
  auth: {
  }
};
