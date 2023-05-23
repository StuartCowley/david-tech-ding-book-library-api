const express = require("express")
const readerController = require("./controllers/reader")
const { Reader } = require("./models/reader")
const app = express()

app.use(express.json())

app.post("/readers", readerController.createReader)

module.exports = app
