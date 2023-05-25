const { expect } = require("chai")
const request = require("supertest")
const { Book } = require("../src/models")
const app = require("../src/app")

describe("/books", () => {
  before(async () => {
    await Book.sequelize.sync({ force: true })
  })

  describe("with no records in the database", () => {
    describe("POST /books", () => {
      let testBook

      beforeEach(async () => {
        await Book.destroy({ where: {} })
        testBook = {
          title: "My Life",
          author: "David Ding",
          genre: "Biography",
          ISBN: "100-888-888",
        }
      })
      it("creates a new book in the database", async () => {
        const response = await request(app).post("/books").send(testBook)
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        })

        expect(response.status).to.equal(201)
        expect(response.body.title).to.equal("My Life")
        expect(newBookRecord.title).to.equal("My Life")
        expect(newBookRecord.author).to.equal("David Ding")
        expect(newBookRecord.genre).to.equal("Biography")
        expect(newBookRecord.ISBN).to.equal("100-888-888")
      })

      it("returns an error when a title is not provided", async () => {
        testBook.title = null
        const response = await request(app).post("/books").send(testBook)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal("Title is required")
      })

      it("returns an error when a title is empty", async () => {
        testBook.title = " "
        const response = await request(app).post("/books").send(testBook)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal("Title cannot be empty")
      })

      it("returns an error when an author is not provided", async () => {
        testBook.author = null
        const response = await request(app).post("/books").send(testBook)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal("Author is required")
      })

      it("returns an error when an author is empty", async () => {
        testBook.author = " "
        const response = await request(app).post("/books").send(testBook)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal("Author cannot be empty")
      })
    })
  })

  describe("with records in the database", () => {
    let books
    beforeEach(async () => {
      books = await Promise.all([
        Book.create({
          title: "My Life",
          author: "David Ding",
          genre: "Biography",
          ISBN: "100-888-888",
        }),
        Book.create({
          title: "His Life",
          author: "Jensen Huang",
          genre: "Biography",
          ISBN: "100-868-888",
        }),
        Book.create({
          title: "Her Life as a SWE",
          author: "Sarah Lee",
          genre: "Biography",
          ISBN: "100-886-888",
        }),
      ])
    })

    describe("GET /books", () => {
      it("gets all books records", async () => {
        const response = await request(app).get("/books")

        expect(response.status).to.equal(200)
        expect(response.body.length).to.equal(3)

        response.body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id)

          expect(book.title).to.equal(expected.title)
          expect(book.author).to.equal(expected.author)
          expect(book.genre).to.equal(expected.genre)
          expect(book.ISBN).to.equal(expected.ISBN)
        })
      })
    })

    describe("GET /books/:id", () => {
      it("gets books record by id", async () => {
        const book = books[0]
        const response = await request(app).get(`/books/${book.id}`)

        expect(response.status).to.equal(200)
        expect(response.body.title).to.equal(book.title)
        expect(response.body.author).to.equal(book.author)
        expect(response.body.genre).to.equal(book.genre)
        expect(response.body.ISBN).to.equal(book.ISBN)
      })

      it("returns a 404 if the book does not exist", async () => {
        const response = await request(app).get("/books/12345")

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal("The book does not exist.")
      })
    })

    describe("PATCH /books/:id", () => {
      it("updates books records by id", async () => {
        const book = books[0]
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ title: "My Life" })
        const updatedBookRecord = await Book.findByPk(book.id, {
          raw: true,
        })

        expect(response.status).to.equal(200)
        expect(updatedBookRecord.title).to.equal("My Life")
      })

      it("returns a 404 if the book does not exist", async () => {
        const response = await request(app)
          .patch("/books/12345")
          .send({ title: "some new title" })

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal("The book does not exist.")
      })
    })
    describe("DELETE /books/:id", () => {
      it("deletes book record by id", async () => {
        const book = books[0]
        const response = await request(app).delete(`/books/${book.id}`)
        const deletedBook = await Book.findByPk(book.id, { raw: true })

        expect(response.status).to.equal(204)
        expect(deletedBook).to.equal(null)
      })

      it("returns a 404 if the book does not exist", async () => {
        const response = await request(app).delete("/books/12345")
        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal("The book does not exist.")
      })
    })
  })
})
