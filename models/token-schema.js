module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define("token_table", {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user_tables',
        key: 'id',    
      },
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      },
    }
  })

  return Token
}
