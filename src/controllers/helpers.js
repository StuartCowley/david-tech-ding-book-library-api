const { Reader, Book, Author, Genre } = require("../models")
const error404 = (model) => ({ error: `The ${model} does not exist.` })
const getModel = (model) => {
  const models = {
    reader: Reader,
    book: Book,
    author: Author,
    genre: Genre,
  }

  return models[model]
}

const getOptions = (model) => {
  if (model === "book") return { include: [Genre, Author, Reader] }
  if (model === "genre" || model === "author" || model === "genre")
    return { include: Book }
}

const removePassword = (obj) => {
  if (obj.hasOwnProperty("password")) {
    delete obj.password
  }
  return obj
}
const createEntry = async (res, model, entry) => {
  const Model = getModel(model)

  try {
    const newEntry = await Model.create(entry)
    const entryWithoutPassword = removePassword(newEntry.get())
    res.status(201).json(entryWithoutPassword)
  } catch (err) {
    const errorMessage = err.errors.map((e) => e.message)
    res.status(400).json({ error: errorMessage[0] })
  }
}

const getAllEntry = async (res, model) => {
  try {
    const Model = getModel(model)
    const newEntry = await Model.findAll(getOptions(model))

    if (model === "book") {
      newEntry.forEach((entry) => {
        if (entry.Reader) {
          removePassword(entry.Reader.get())
        }
      })
    }

    const entryWithoutPassword = newEntry.map((entry) =>
      removePassword(entry.get())
    )

    res.status(200).json(entryWithoutPassword)
  } catch (err) {
    res.status(500).json(err.message)
  }
}

const getEntryById = async (res, model, id) => {
  const Model = getModel(model)
  const newEntry = await Model.findByPk(id, getOptions(model))
  try {
    if (!newEntry) {
      res.status(404).json(error404(model))
    }
    const entryWithoutPassword = removePassword(newEntry.get())
    res.status(200).json(entryWithoutPassword)
  } catch (err) {
    res.status(500).json(err.message)
  }
}

const updateEntryById = async (res, model, entry, id) => {
  const Model = getModel(model)
  const [entryUpdated] = await Model.update(entry, { where: { id } })

  try {
    if (!entryUpdated) {
      res.status(404).json(error404(model))
    }
    const updatedEntry = await Model.findByPk(id)
    const entryWithoutPassword = removePassword(updatedEntry.get())
    res.status(200).json(entryWithoutPassword)
  } catch (err) {
    res.status(500).json(err.message)
  }
}

const deleteEntryById = async (res, model, id) => {
  const Model = getModel(model)
  try {
    const deletedRows = await Model.destroy({ where: { id } })

    if (!deletedRows) {
      res.status(404).json(error404(model))
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
  removePassword,
}
