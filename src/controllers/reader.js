const { Reader } = require("../models")
const {
  createEntry,
  getAllEntry,
  getEntryById,
  updateEntryById,
} = require("./helpers")

const createReader = (req, res) => createEntry(res, "reader", req.body)

const getAllReaders = (_, res) => getAllEntry(res, "reader", _)

const getReaderById = async (req, res) =>
  getEntryById(res, "reader", req.params.id)

const updateReader = (req, res) =>
  updateEntryById(res, "reader", req.body, req.params.id)

const deleteReader = async (req, res) => {
  try {
    const { id } = req.params
    const reader = await Reader.findByPk(id)
    const deletedRows = await Reader.destroy({ where: { id } })

    if (!reader) {
      res.status(404).json({ error: "The reader does not exist." })
    }
    res.status(204).json(deletedRows)
  } catch (err) {
    res.status(500).json(err.message)
  }
}
module.exports = {
  createReader,
  getAllReaders,
  getReaderById,
  updateReader,
  deleteReader,
}
