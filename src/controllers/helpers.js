const { Model } = require("sequelize")
const { Reader, Book } = require("../models")

const getModel = (model) => {
  const models = {
    reader: Reader,
    book: Book,
  }

  return models[model]
}

const createEntry = async (res, model, entry) => {
  const Model = getModel(model)

  try {
    const newEntry = await Model.create(entry)
    res.status(201).json(newEntry)
  } catch (err) {
    const errorMessage = err.errors.map((e) => e.message)
    res.status(400).json({ error: errorMessage[0] })
  }
}

const getAllEntry = async (res, model) => {
  const Model = getModel(model)
  try {
    const newEntry = await Model.findAll()
    res.status(200).json(newEntry)
  } catch (err) {
    res.status(500).json(err.message)
  }
}
const getEntryById = async (res, model, id) => {
  const Model = getModel(model)
  try {
    const newEntry = await Model.findByPk(id)
    if (!newEntry) {
      res.status(404).json({ error: `The ${model} does not exist.` })
    }
    res.status(200).json(newEntry)
  } catch (err) {
    res.status(500).json(err.message)
  }
}

const updateEntryById = async (res, model, entry, id) => {
  const Model = getModel(model)
  try {
    const [newEntry] = await Model.update(entry, { where: { id } })
    if (!newEntry) {
      res.status(404).json({ error: `The ${model} does not exist.` })
    }
    res.status(200).json(newEntry)
  } catch (err) {
    res.status(500).json(err.message)
  }
}

const deleteEntryById = async (res, model, id) => {
  const Model = getModel(model)
  try {
    const deletedRows = await Model.destroy({ where: { id } })

    if (!deletedRows) {
      res.status(404).json({ error: `The ${model} does not exist.` })
    }
    res.status(204).json(deletedRows)
  } catch (err) {
    res.status(500).json(err.message)
  }
}

module.exports = {
  getModel,
  createEntry,
  getAllEntry,
  getEntryById,
  updateEntryById,
  deleteEntryById,
}
