const { Reader } = require("../models")
const {
  createEntry,
  getAllEntry,
  getEntryById,
  updateEntryById,
  deleteEntryById,
} = require("./helpers")

const createReader = (req, res) => createEntry(res, "reader", req.body)

const getAllReaders = (_, res) => getAllEntry(res, "reader", _)

const getReaderById = (req, res) => getEntryById(res, "reader", req.params.id)

const updateReader = (req, res) =>
  updateEntryById(res, "reader", req.body, req.params.id)

const deleteReader = (req, res) => deleteEntryById(res, "reader", req.params.id)

module.exports = {
  createReader,
  getAllReaders,
  getReaderById,
  updateReader,
  deleteReader,
}
