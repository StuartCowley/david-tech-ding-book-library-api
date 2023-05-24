const express = require("express")
const bookController = require("../controllers/book")
const bookRouter = express.Router()

bookRouter.post("/", bookController.createBook)
bookRouter.get("/", bookController.getAllBooks)
bookRouter.get("/:id", bookController.getBookById)
bookRouter.patch("/:id", bookController.updateBook)
bookRouter.delete("/:id", bookController.deleteBook)

module.exports = bookRouter
