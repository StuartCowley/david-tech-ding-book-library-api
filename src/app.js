const express = require("express")
const readerRouter = require("./routers/reader")
const bookRouter = require("./routers/book")
const authorRouter = require("./routers/author")
const genreRouter = require("./routers/genre")

const app = express()

app.use(express.json())
app.use("/readers", readerRouter)
app.use("/books", bookRouter)
app.use("/authors", authorRouter)
app.use("/genres", genreRouter)

module.exports = app
