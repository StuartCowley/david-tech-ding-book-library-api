const express = require("express")
const readerController = require("../controllers/reader")
const readerRouter = express.Router()

readerRouter.post("/", readerController.createReader)
readerRouter.get("/", readerController.getAllReaders)
readerRouter.get("/:id", readerController.getReaderById)
readerRouter.patch("/:id", readerController.updateReader)
readerRouter.delete("/:id", readerController.deleteReader)

module.exports = readerRouter
