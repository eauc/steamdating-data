module.exports = (sequelize, DataType) => {
  const Tournaments = sequelize.define('Tournaments', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    date: {
      type: DataType.DATEONLY,
      allowNull: false
    },
    data: {
      type: DataType.TEXT('long'),
      allowNull: false,
      defaultValue: ''
    }
  });
  return Tournaments;
};
