const express = require("express")
const readerController = require("./controllers/reader")
const reader = require("./models/reader")
const app = express()

app.use(express.json())

app.post("/readers", readerController.createReader)

app.get("/readers", readerController.getAllReaders)

app.get("/readers/:id", readerController.getReaderById)

app.patch("/readers/:id", readerController.updateReader)

app.delete("/readers/:id", readerController.deleteReader)

module.exports = app
