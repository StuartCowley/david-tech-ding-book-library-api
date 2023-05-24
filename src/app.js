const express = require("express")
const { Reader } = require("./models")
const readerRouter = require("./routers/reader")
const readerController = require("./controllers/reader")

const app = express()

app.use(express.json())
app.use("/readers", readerRouter)

module.exports = app
