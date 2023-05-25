module.exports = (connection, DataTypes) => {
  const schema = {
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: [true],
        msg: "Author needs to be unique",
      },
      validate: {
        notNull: {
          args: [true],
          msg: "Author is required",
        },
        notEmpty: {
          args: [true],
          msg: "Author cannot be empty",
        },
      },
    },
  }
  const AuthorModel = connection.define("Author", schema)
  return AuthorModel
}
