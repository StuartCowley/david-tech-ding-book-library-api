const { Book } = require("../models")
const { createEntry, getAllEntry, getEntryById } = require("./helpers")

const createBook = (req, res) => createEntry(res, "book", req.body)

const getAllBooks = (_, res) => getAllEntry(res, "book", _)

const getBookById = async (req, res) => getEntryById(res, "book", req.params.id)

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
