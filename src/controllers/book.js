const { Book } = require("../models")
const {
  createEntry,
  getAllEntry,
  getEntryById,
  updateEntryById,
  deleteEntryById,
} = require("./helpers")

const createBook = (req, res) => createEntry(res, "book", req.body)

const getAllBooks = (_, res) => getAllEntry(res, "book", _)

const getBookById = (req, res) => getEntryById(res, "book", req.params.id)

const updateBook = (req, res) =>
  updateEntryById(res, "book", req.body, req.params.id)

const deleteBook = (req, res) => deleteEntryById(res, "book", req.params.id)

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
}
