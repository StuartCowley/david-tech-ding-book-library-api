module.exports = (connection, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: [true],
          msg: "Title is required",
        },
        notEmpty: {
          args: [true],
          msg: "Title cannot be empty",
        },
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
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
    ISBN: DataTypes.STRING,
  }

  const BookModel = connection.define("Book", schema)
  return BookModel
}
