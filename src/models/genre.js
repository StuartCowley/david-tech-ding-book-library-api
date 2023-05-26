module.exports = (connection, DataTypes) => {
  const schema = {
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: [true],
        msg: "Genre needs to be unique",
      },
      validate: {
        notNull: {
          args: [true],
          msg: "Genre is required",
        },
        notEmpty: {
          args: [true],
          msg: "Genre cannot be empty",
        },
      },
    },
  }
  const GenreModel = connection.define("Genre", schema)
  return GenreModel
}
