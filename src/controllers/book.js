const { Book } = require("../models")

const createBook = async (req, res) => {
  const newBook = await Book.create(req.body)
  res.status(201).json(newBook)
}
module.exports = { createBook }
