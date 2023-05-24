const { Book } = require("../models")

const createBook = async (req, res) => {
  const newBook = await Book.create(req.body)
  res.status(201).json(newBook)
}

const getAllBooks = async (_, res) => {
  const books = await Book.findAll()
  res.status(200).json(books)
}

module.exports = { createBook, getAllBooks }
