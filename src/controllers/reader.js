const { Reader } = require("../models")

const createReader = async (req, res) => {
  try {
    const newReader = await Reader.create(req.body)
    res.status(201).json(newReader)
  } catch (err) {
    const errorMessage = err.errors.map((e) => e.message)
    res.status(400).json({ error: errorMessage[0] })
  }
}

const getAllReaders = async (_, res) => {
  const reader = await Reader.findAll()
  res.status(200).json(reader)
}

const getReaderById = async (req, res) => {
  const { id } = req.params
  const reader = await Reader.findByPk(id)

  if (!reader) {
    res.status(404).json({ error: "The reader could not be found." })
  }
  res.status(200).json(reader)
}

const updateReader = async (req, res) => {
  const { id } = req.params
  const [reader] = await Reader.update(req.body, {
    where: { id },
  })

  if (!reader) {
    res.status(404).json({ error: "The reader could not be found." })
  }

  res.status(200).json(reader)
}

const deleteReader = async (req, res) => {
  try {
    const { id } = req.params
    const reader = await Reader.findByPk(id)
    const deletedRows = await Reader.destroy({ where: { id } })

    if (!reader) {
      res.status(404).json({ error: "The reader could not be found." })
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
