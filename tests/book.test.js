const { expect } = require("chai")
const request = require("supertest")
const { Book } = require("../src/models")
const app = require("../src/app")

describe("/books", () => {
  before(async () => {
    await Book.sequelize.sync({ force: true })
  })

  beforeEach(async () => {
    await Book.destroy({ where: {} })
  })

  describe("with no records in the database", () => {
    describe("POST /books", () => {
      it("creates a new book in the database", async () => {
        const response = await request(app).post("/books").send({
          title: "My Life",
          author: "David Ding",
          genre: "Biography",
          ISBN: "100-888-888",
        })
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
  })
})