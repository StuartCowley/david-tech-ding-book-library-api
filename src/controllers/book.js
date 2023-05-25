const { Book, Reader } = require("../models")

const createBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body)
    res.status(201).json(newBook)
  } catch (err) {
    console.log(err)
    const errorMessage = err.errors.map((e) => e.message)
    res.status(400).json({ error: errorMessage[0] })
  }
}

const getAllBooks = async (_, res) => {
  const books = await Book.findAll()
  res.status(200).json(books)
}

const getBookById = async (req, res) => {
  const { id } = req.params
  const book = await Book.findByPk(id)

  if (!book) {
    res.status(404).json({ error: "The book does not exist." })
  }
  res.status(200).json(book)
}

const updateBook = async (req, res) => {
  const { id } = req.params
  const [book] = await Book.update(req.body, { where: { id } })

  if (!book) {
    res.status(404).json({ error: "The book does not exist." })
  }
  res.status(200).json(book)
}

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params
    const book = await Book.findByPk(id)
    const deletedRows = await Book.destroy({ where: { id } })

    if (!book) {
      res.status(404).json({ error: "The book does not exist." })
    }
    res.status(204).json(deletedRows)
  } catch (err) {
    res.status(500).json(err.message)
  }
}

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
}
